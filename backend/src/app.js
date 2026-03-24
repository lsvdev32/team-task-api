const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.get("/api/health", (req, res) => {
  res.json({ message: "API running" });
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const frontendPath = path.join(__dirname, "../public");
const frontendIndexPath = path.join(frontendPath, "index.html");

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendPath));

  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
}

app.use(errorHandler);
module.exports = app;