const bcrypt = require("bcryptjs");
const { User } = require("../models");

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user.toJSON();
  return safeUser;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    res.status(500).json({
      message: "Error al crear usuario",
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      password: updatedPassword
    });
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
