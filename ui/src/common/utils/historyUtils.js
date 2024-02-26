export function sortDescending(a, b) {
  return new Date(b.updated_at) - new Date(a.updated_at);
}

export function sortAscending(a, b) {
  return new Date(a.updated_at) - new Date(b.updated_at);
}
