type RouteEntity = {
  id?: number | string | null;
  slug?: string | null;
};

const getRouteKey = (entity?: RouteEntity | null) => {
  const slug = entity?.slug?.trim();
  if (slug) return slug;
  return entity?.id ?? "";
};

export const getCategoryPath = (category?: RouteEntity | null) =>
  `/exams/${getRouteKey(category)}`;

export const getSubCategoryPath = (subCategory?: RouteEntity | null) =>
  `/exams/${getRouteKey(subCategory)}`;
