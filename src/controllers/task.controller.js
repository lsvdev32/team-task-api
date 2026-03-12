const { Op } = require("sequelize");
const { Task, User } = require("../models");
const validStatuses = ["pending", "in_progress", "completed"];
const validPriorities = ["low", "medium", "high"];
const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, userId, search } = req.query;
    const where = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "El status debe ser pending, in_progress o completed"
        });
      }
      where.status = status;
    }
    if (priority) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          message: "La prioridad debe ser low, medium o high"
        });
      }
      where.priority = priority;
    }
    if (userId) {
      if (!/^\d+$/.test(userId)) {
        return res.status(400).json({
          message: "El userId debe ser numerico"
        });
      }
      where.userId = Number(userId);
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
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
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "El id de la tarea debe ser numerico" });
    }

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
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, userId } = req.body;
    if (!title || !userId) {
      return res.status(400).json({
        message: "El titulo y el userId son obligatorios"
      });
    }
    if (typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        message: "El titulo debe tener minimo 3 caracteres"
      });
    }
    if (!/^\d+$/.test(String(userId))) {
      return res.status(400).json({
        message: "El userId debe ser numerico"
      });
    }
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "El status debe ser pending, in_progress o completed"
      });
    }
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "La prioridad debe ser low, medium o high"
      });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "El usuario asociado no existe"
      });
    }
    const newTask = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : description,
      status: status || "pending",
      priority: priority || "medium",
      userId: Number(userId)
       });
    return res.status(201).json({
      message: "Tarea creada correctamente",
      task: newTask
    });
  } catch (error) {
    next(error);
  }
};
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, userId } = req.body;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "El id de la tarea debe ser numerico" });
    }
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({
          message: "El titulo debe tener minimo 3 caracteres"
        });
      }
    }
    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "El status debe ser pending, in_progress o completed"
      });
    }
    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "La prioridad debe ser low, medium o high"
      });
    }
    if (userId !== undefined) {
      if (!/^\d+$/.test(String(userId))) {
        return res.status(400).json({
          message: "El userId debe ser numerico"
        });
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          message: "El usuario asociado no existe"
        });
      }
    }
    await task.update({
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined
        ? (typeof description === "string" ? description.trim() : description)
        : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      userId: userId !== undefined ? Number(userId) : task.userId
    });
     return res.status(200).json({
      message: "Tarea actualizada correctamente",
      task
    });
  } catch (error) {
    next(error);
  }
};
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "El id de la tarea debe ser numerico" });
    }
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    await task.destroy();
    return res.status(200).json({
      message: "Tarea eliminada correctamente"
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};