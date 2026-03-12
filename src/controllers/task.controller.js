const { Op } = require("sequelize");
const { Task, User } = require("../models");

const VALID_STATUS = ["pending", "in_progress", "completed"];
const VALID_PRIORITY = ["low", "medium", "high"];

const sanitizeTask = (taskInstance) => {
  const task = taskInstance.toJSON();

  if (task.user && task.user.password) {
    delete task.user.password;
  }

  return task;
};

const buildTaskFilters = ({ status, priority, userId, search }) => {
  const where = {};

  if (status) {
    if (!VALID_STATUS.includes(status)) {
      return {
        error: `El estado debe ser uno de: ${VALID_STATUS.join(", ")}`
      };
    }
    where.status = status;
  }

  if (priority) {
    if (!VALID_PRIORITY.includes(priority)) {
      return {
        error: `La prioridad debe ser una de: ${VALID_PRIORITY.join(", ")}`
      };
    }
    where.priority = priority;
  }

  if (userId) {
    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
      return {
        error: "El userId debe ser un número válido mayor que cero"
      };
    }

    where.userId = parsedUserId;
  }

  if (search && search.trim() !== "") {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${search.trim()}%`
        }
      },
      {
        description: {
          [Op.like]: `%${search.trim()}%`
        }
      }
    ];
  }

  return { where };
};

const getAllTasks = async (req, res) => {
  try {
    const { status, priority, userId, search } = req.query;

    const filterResult = buildTaskFilters({ status, priority, userId, search });

    if (filterResult.error) {
      return res.status(400).json({
        message: filterResult.error
      });
    }

    const tasks = await Task.findAll({
      where: filterResult.where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["id", "ASC"]]
    });

    res.status(200).json(tasks.map(sanitizeTask));
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las tareas",
      error: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (Number.isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "El id de la tarea debe ser un número válido"
      });
    }

    const task = await Task.findByPk(parsedId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada"
      });
    }

    res.status(200).json(sanitizeTask(task));
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la tarea",
      error: error.message
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({
        message: "El título y el userId son obligatorios"
      });
    }

    if (typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        message: "El título debe tener al menos 3 caracteres"
      });
    }

    if (description && typeof description !== "string") {
      return res.status(400).json({
        message: "La descripción debe ser un texto válido"
      });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        message: `El estado debe ser uno de: ${VALID_STATUS.join(", ")}`
      });
    }

    if (priority && !VALID_PRIORITY.includes(priority)) {
      return res.status(400).json({
        message: `La prioridad debe ser una de: ${VALID_PRIORITY.join(", ")}`
      });
    }

    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
      return res.status(400).json({
        message: "El userId debe ser un número válido mayor que cero"
      });
    }

    const userExists = await User.findByPk(parsedUserId);

    if (!userExists) {
      return res.status(404).json({
        message: "No existe un usuario con el userId enviado"
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      status: status || "pending",
      priority: priority || "medium",
      userId: parsedUserId
    });

    const createdTask = await Task.findByPk(newTask.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.status(201).json({
      message: "Tarea creada correctamente",
      task: sanitizeTask(createdTask)
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, userId } = req.body;

    const parsedId = Number(id);

    if (Number.isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "El id de la tarea debe ser un número válido"
      });
    }

    const task = await Task.findByPk(parsedId);

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada"
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({
          message: "El título debe tener al menos 3 caracteres"
        });
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "La descripción debe ser un texto válido"
        });
      }
    }

    if (status !== undefined && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        message: `El estado debe ser uno de: ${VALID_STATUS.join(", ")}`
      });
    }

    if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
      return res.status(400).json({
        message: `La prioridad debe ser una de: ${VALID_PRIORITY.join(", ")}`
      });
    }

    let parsedUserId = task.userId;

    if (userId !== undefined) {
      parsedUserId = Number(userId);

      if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
        return res.status(400).json({
          message: "El userId debe ser un número válido mayor que cero"
        });
      }

      const userExists = await User.findByPk(parsedUserId);

      if (!userExists) {
        return res.status(404).json({
          message: "No existe un usuario con el userId enviado"
        });
      }
    }

    await task.update({
      title: title !== undefined ? title.trim() : task.title,
      description:
        description !== undefined
          ? description === null
            ? null
            : description.trim()
          : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      userId: parsedUserId
    });

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.status(200).json({
      message: "Tarea actualizada correctamente",
      task: sanitizeTask(updatedTask)
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la tarea",
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    if (Number.isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "El id de la tarea debe ser un número válido"
      });
    }

    const task = await Task.findByPk(parsedId);

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada"
      });
    }

    await task.destroy();

    res.status(200).json({
      message: "Tarea eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la tarea",
      error: error.message
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};