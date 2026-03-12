const { User } = require("../models");
const bcrypt = require("bcrypt");


const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "El id del usuario debe ser numerico" });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son obligatorios"
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        message: "El nombre debe tener minimo 2 caracteres"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "El email no tiene un formato valido"
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener minimo 6 caracteres"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe un usuario con ese email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        message: "El id del usuario debe ser numerico"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
          message: "El nombre debe tener minimo 2 caracteres"
        });
      }
    }

    let normalizedEmail = user.email;

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (typeof email !== "string" || !emailRegex.test(email)) {
        return res.status(400).json({
          message: "El email no tiene un formato valido"
        });
      }

      normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          where: { email: normalizedEmail }
        });

        if (existingUser) {
          return res.status(409).json({
            message: "Ya existe un usuario con ese email"
          });
        }
      }
    }

    let hashedPassword = user.password;

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener minimo 6 caracteres"
        });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      name: name !== undefined ? name.trim() : user.name,
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "El id del usuario debe ser numerico" });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.destroy();
    return res.status(200).json({
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
