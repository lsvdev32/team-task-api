const { Op } = require("sequelize");
const { Task, User } = require("../models");

const getAllTasks = async (req, res) => {
  try {
    const { status, priority, userId, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          description: {
            [Op.like]: `%${search}%`
          }
        }
      ];
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["id", "ASC"]]
    });

    res.status(200).json(tasks);
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
    const task = await Task.findByPk(id, {
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

    res.status(200).json(task);
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

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      userId
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
      task: createdTask
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

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada"
      });
    }

    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
      priority: priority ?? task.priority,
      userId: userId ?? task.userId
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
      task: updatedTask
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
    const task = await Task.findByPk(id);

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
