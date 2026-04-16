export function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const p = Math.max(1, page);
  const start = (p - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function pageRange(page = 1, pageSize = 20) {
  const p = Math.max(1, page);
  const start = (p - 1) * pageSize;
  return { start, end: start + pageSize };
}
