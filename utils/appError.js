export default class AppError extends Error {
  constructor(statusCode, type, message) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
  }
}