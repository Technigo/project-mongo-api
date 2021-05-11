/* eslint-disable no-unused-vars */
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.type = err.type || 'error';

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      type: err.type,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      error: err.type,
      message: err.message
    });
  }
};