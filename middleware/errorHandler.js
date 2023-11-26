// Define the error handling middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
