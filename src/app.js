const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    message: "API running"
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;