const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
