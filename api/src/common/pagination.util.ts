import { Model } from 'mongoose';

export async function paginate<T>(
  model: Model<T>,
  page: number = 1,
  limit: number = 10,
  query: any = {},
  projection?: any,
  options?: any,
): Promise<{
  list: any;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query, projection, options).skip(skip).limit(limit).exec(),
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    list: data,
    page,
    limit,
    total,
    totalPages,
  };
}
