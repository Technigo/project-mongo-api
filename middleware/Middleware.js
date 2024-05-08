// Define a middleware to handle global error
export const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 400;
  error.message =
    error.message ||
    "Your params or query params are not acceptable. Go to the homepage and check what params are acceptable.";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    success: false,
  });
};

// Define a middleware to control the request method
export const methodController = (req, res, next) => {
  if (req.method !== "GET") {
    const err = new Error(
      `${req.method} method is not implemented yet. Try GET method instead.`
    );
    err.statusCode = 501;
    throw err;
  }
  next();
};

// Define a middleware to refuse all the query params
export const queryParamContoller = (req, res, next) => {
  const queryParams = req.query;
  if (Object.keys(queryParams).length > 0) throw new Error();
  next();
};
