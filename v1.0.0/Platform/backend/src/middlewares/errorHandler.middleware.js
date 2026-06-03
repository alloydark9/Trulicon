const errMiddleware = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.error(err);

  // Cast Error
  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  // Duplicate Key
  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = 400;
  }

  // Validation Error
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    error.statusCode = 400;
  }

  // Invalid JSON
  if (err.type === "entity.parse.failed") {
    error.message = "Invalid JSON format provided";
    error.statusCode = 400;
  }

  // Generic Mongoose Errors
  if (err.name === "MongooseError") {
    error.message = err.message || "Database error occurred";
    error.statusCode = 500;
  }

  // Auth Protection Errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (error.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ message: "Token expired, please login again" });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errMiddleware;
