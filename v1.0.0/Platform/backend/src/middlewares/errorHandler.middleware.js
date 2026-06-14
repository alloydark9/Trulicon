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

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    error.message = err.message || "JWT error occurred";

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
  if (error.name === "TokenExpiredError") {
    error.message = err.message || "Token has expired, please log in again";
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errMiddleware;
