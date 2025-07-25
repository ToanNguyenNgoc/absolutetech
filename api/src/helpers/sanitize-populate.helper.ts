export const sanitizePopulate = (populate: any): any => {
  if (typeof populate === 'string') {
    return { path: populate, match: { deletedAt: null } };
  }

  if (Array.isArray(populate)) {
    return populate.map(sanitizePopulate);
  }

  const newPopulate = { ...populate };
  newPopulate.match = {
    ...(newPopulate.match || {}),
    deletedAt: null,
  };

  if (newPopulate.populate) {
    newPopulate.populate = sanitizePopulate(newPopulate.populate);
  }

  return newPopulate;
};
