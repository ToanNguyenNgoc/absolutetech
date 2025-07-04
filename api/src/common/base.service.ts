/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Model, FilterQuery } from 'mongoose';
import { buildMongoQuery } from './query-builder.util';

interface SearchParams {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
  populate?: string | string[];
  includeDeleted?: boolean;
}

export class BaseService<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string, includeDeleted = false): Promise<T | null> {
    const query: FilterQuery<T> = { _id: id } as any;
    if (!includeDeleted) {
      //@ts-ignore
      query.deleted_at = null;
    }
    return this.model.findOne(query).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
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
    } = params;

    const finalFilters = {
      ...filters,
      ...(includeDeleted ? {} : { deleted_at: null }),
    };

    const {
      query,
      pagination,
      sort: sortOption,
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

    const [data, total] = await Promise.all([
      mongooseQuery.exec(),
      this.model.countDocuments(query as FilterQuery<T>).exec(),
    ]);

    return {
      list: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
