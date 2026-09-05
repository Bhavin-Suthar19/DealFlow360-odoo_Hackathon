

export const paginate = async (model, filter = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, Math.min(1000, parseInt(options.limit || 50, 10)));
  const skip = (page - 1) * limit;

  const sort = options.sort || { created_at: -1, createdAt: -1, _id: -1 };
  const populate = options.populate || [];

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (Array.isArray(populate)) {
    populate.forEach((pop) => {
      query = query.populate(pop);
    });
  }

  const [data, total] = await Promise.all([query.exec(), model.countDocuments(filter)]);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export default paginate;
