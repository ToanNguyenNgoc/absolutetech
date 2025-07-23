interface SearchOptions {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  sort?: string; // Ex: 'createdAt' or '-createdAt'
  page?: number;
  limit?: number;
}

export function buildMongoQuery(options: SearchOptions): {
  query: Record<string, any>;
  pagination: { skip: number; limit: number };
  sort: Record<string, 1 | -1>;
  postFilterFields: string[];
} {
  const {
    search,
    searchFields = [],
    filters = {},
    sort = '-createdAt',
    page = 1,
    limit = 15,
  } = options;

  const query: any = {};

  const flatFields = searchFields.filter((f) => !f.includes('.'));
  const nestedFields = searchFields.filter((f) => f.includes('.'));

  if (search && flatFields.length > 0) {
    query.$or = flatFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  Object.assign(query, filters);

  const skip = (page - 1) * limit;
  const sortOption: Record<string, 1 | -1> = {};

  if (sort) {
    const direction = sort.startsWith('-') ? -1 : 1;
    const field = sort.replace(/^-/, '');
    sortOption[field] = direction;
  }

  return {
    query,
    pagination: { skip, limit },
    sort: sortOption,
    postFilterFields: nestedFields,
  };
}
