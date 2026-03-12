const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");

router.post("/", createUser);

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;