const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios"
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
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales invalidas"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales invalidas"
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Inicio de sesion exitoso",
      token
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  login
};