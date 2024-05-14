function getPaginationParameters(req) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { skip, limit };
}

export default getPaginationParameters;
