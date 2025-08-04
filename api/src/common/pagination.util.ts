import { Model } from 'mongoose';
import { SearchParams } from './base.service';
import { Utils } from 'src/utils/utils';

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

interface PaginateWithAggregateParams extends SearchParams {
  model: any;
}
export async function paginateWithAggregate(
  params: PaginateWithAggregateParams,
): Promise<{
  list: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const {
    model,
    search,
    searchFields = [],
    pipeline = [],
    filters = {},
    sort = '-createdAt',
    includeDeleted = false,
    page = 1,
    limit = 15,
  } = params;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const matchStage: Record<string, any> = {
    ...Utils.removeNullUn(filters),
    ...(includeDeleted ? {} : { deleted_at: null }),
  };

  pipeline.push({ $match: matchStage });

  if (search && searchFields.length) {
    const regex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        $or: searchFields.map((field) => ({
          [field]: { $regex: regex },
        })),
      },
    });
  }

  const sortField = sort.replace(/^-/, '');
  const sortOrder = sort.startsWith('-') ? -1 : 1;
  pipeline.push({ $sort: { [sortField]: sortOrder } });

  pipeline.push({
    $facet: {
      list: [
        { $skip: (parsedPage - 1) * parsedLimit },
        { $limit: parsedLimit },
      ],
      total: [{ $count: 'count' }],
    },
  });
  const result = await model.aggregate(pipeline).exec();
  const list = (result[0]?.list || []).map((i) => ({ ...i, id: i._id }));
  const total = result[0]?.total?.[0]?.count || 0;
  return {
    list,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
}
