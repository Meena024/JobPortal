export const getUniqueValues = (items, key) =>
  [...new Set(items.map((item) => item[key]))].sort();
