const { User } = require("../models");

const sanitizeUser = (user) => {
const { password, ...userWithoutPassword } = user.toJSON();
return userWithoutPassword;
};

const getAllUsers = async (req, res) => {
try {
const users = await User.findAll({
order: [["id", "ASC"]]
});
const sanitizedUsers = users.map(sanitizeUser);
res.status(200).json(sanitizedUsers);
} catch (error) {
res.status(500).json({
message: "Error al obtener los usuarios",
error: error.message
});
}
};
const getUserById = async (req, res) => {
try {
const { id } = req.params;
const user = await User.findByPk(id);
if (!user) {
return res.status(404).json({
message: "Usuario no encontrado"
});
}
res.status(200).json(sanitizeUser(user));
} catch (error) {
res.status(500).json({
message: "Error al obtener el usuario",
error: error.message
});
}
};
const createUser = async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) {
return res.status(400).json({
message: "Nombre, email y contraseña son obligatorios"
});
}
const existingUser = await User.findOne({
where: { email }
});
if (existingUser) {
return res.status(409).json({
message: "Ya existe un usuario con ese email"
});
}
const newUser = await User.create({
name,
email,
password
});
res.status(201).json({
message: "Usuario creado correctamente",
user: sanitizeUser(newUser)
});} catch (error) {
res.status(500).json({
message: "Error al crear el usuario",
error: error.message
});
}
};
const updateUser = async (req, res) => {
try {
const { id } = req.params;
const { name, email, password } = req.body;
const user = await User.findByPk(id);
if (!user) {
return res.status(404).json({
message: "Usuario no encontrado"
});
}
if (email && email !== user.email) {
const existingUser = await User.findOne({
where: { email }
});
if (existingUser) {
return res.status(409).json({
message: "Ya existe un usuario con ese email"
});
}
}
await user.update({
name: name ?? user.name,
email: email ?? user.email,
password: password ?? user.password
});
res.status(200).json({
message: "Usuario actualizado correctamente",
user: sanitizeUser(user)
});
} catch (error) {
res.status(500).json({
message: "Error al actualizar el usuario",
error: error.message
});
}
};
const deleteUser = async (req, res) => {
try {
const { id } = req.params;
const user = await User.findByPk(id);
if (!user) {
return res.status(404).json({
message: "Usuario no encontrado"
});
}
await user.destroy();
res.status(200).json({
message: "Usuario eliminado correctamente"
});
} catch (error) {res.status(500).json({
message: "Error al eliminar el usuario",
error: error.message
});
}
};
module.exports = {
getAllUsers,
getUserById,
createUser,
updateUser,
deleteUser
};