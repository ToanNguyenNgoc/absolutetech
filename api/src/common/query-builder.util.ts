interface SearchOptions {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  sort?: string; // Example: 'createdAt' or '-createdAt'
  page?: number;
  limit?: number;
}

export function buildMongoQuery(options: SearchOptions) {
  const {
    search,
    searchFields = [],
    filters = {},
    sort = '-createdAt',
    page = 1,
    limit = 15,
  } = options;

  const query: any = {};

  // Search conditions
  if (search && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  // Add additional filters
  Object.assign(query, filters);

  // Pagination and sorting
  const skip = (page - 1) * limit;
  const sortOption: any = {};

  if (sort) {
    const direction = sort.startsWith('-') ? -1 : 1;
    const field = sort.replace(/^-/, '');
    sortOption[field] = direction;
  }

  return {
    query,
    pagination: {
      skip,
      limit,
    },
    sort: sortOption,
  };
}
