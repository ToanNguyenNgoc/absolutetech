/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Model, FilterQuery, PipelineStage } from 'mongoose';
import { buildMongoQuery } from './query-builder.util';

interface SearchParams {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  postFilterFields?: string[];
  sort?: string;
  page?: number;
  limit?: number;
  populate?: string | string[] | any;
  includeDeleted?: boolean;
  isVirtuals?: boolean;
  pipeline?: PipelineStage[];
}
//

export class BaseService<T> {
  constructor(protected readonly model: Model<T>) { }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(
    id: string,
    populate?: string | string[] | any,
    includeDeleted = false,
  ): Promise<T | null> {
    const query: FilterQuery<T> = { _id: id } as any;
    if (!includeDeleted) {
      //@ts-ignore
      query.deletedAt = null;
    }
    let mongooseQuery = this.model.findOne(query);
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((field) => {
          mongooseQuery = mongooseQuery.populate(field);
        });
      } else {
        mongooseQuery = mongooseQuery.populate(populate);
      }
    }

    //@ts-ignore
    return mongooseQuery.lean({ virtuals: true }).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
  }

  async findAll(params: SearchParams): Promise<{
    list: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      searchFields = [],
      filters = {},
      sort,
      page = 1,
      limit = 10,
      populate,
      includeDeleted = false,
      isVirtuals = true,
    } = params;

    const finalFilters = {
      ...filters,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    const {
      query,
      pagination,
      sort: sortOption,
      postFilterFields,
    } = buildMongoQuery({
      search,
      searchFields,
      filters: finalFilters,
      sort,
      page,
      limit,
    });

    let mongooseQuery = this.model
      .find(query as FilterQuery<T>)
      .sort(sortOption)
      .skip(pagination.skip)
      .limit(pagination.limit);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((field) => {
          mongooseQuery = mongooseQuery.populate(field);
        });
      } else {
        mongooseQuery = mongooseQuery.populate(populate);
      }
    }

    if (isVirtuals) {
      // @ts-ignore
      mongooseQuery = mongooseQuery.lean({ virtuals: true });
    }

    let data = await mongooseQuery.exec();
    if (search && postFilterFields.length > 0) {
      const keyword = search.toLowerCase();

      data = data.filter((item: any) =>
        postFilterFields.some((path) => {
          const value = path.split('.').reduce((obj, key) => obj?.[key], item);
          return (
            typeof value === 'string' && value.toLowerCase().includes(keyword)
          );
        }),
      );
    }
    const total = data.length;
    return {
      list: data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWithAggregate(params: SearchParams): Promise<{ list: T[]; total: number; page: number; limit: number; totalPages: number; }> {
    const {
      search,
      searchFields = [],
      pipeline = [],
      filters = {},
      sort = '-createdAt',
      includeDeleted = false,
    } = params;

    const matchStage: Record<string, any> = {
      ...(includeDeleted ? {} : { deleted_at: null }),
      ...filters,
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
    // $sort
    const sortField = sort.replace(/^-/, '');
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
    // $facet for pagination
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 15);
    pipeline.push({
      $facet: {
        list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    });
    //
    const result = await this.model.aggregate(pipeline).exec();
    const list = result[0]?.list || [];
    const total = result[0]?.total[0]?.count || 0;
    return {
      list,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
