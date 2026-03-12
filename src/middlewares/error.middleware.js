const errorHandler = (error, req, res, next) => {
  console.error("Unhandled error:", error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({
    message: "Error interno del servidor",
    error: error.message
  });
};
module.exports = errorHandler;