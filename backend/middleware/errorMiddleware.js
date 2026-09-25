// Middleware to handle 404 errors
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// error handling middleware to handle errors in the application
const errorHandler = (err, req, res, next) => {
  // server error status code if not set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Do not expose internal details unless explicitly running in development.
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { notFound, errorHandler };