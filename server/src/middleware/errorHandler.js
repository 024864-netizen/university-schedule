export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: status === 500
      ? "Internal server error"
      : err.message,
    errors: err.errors || [],
  });
};