const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/task.controller");

router.get("/", verifyToken, getAllTasks);
router.get("/:id", verifyToken, getTaskById);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;