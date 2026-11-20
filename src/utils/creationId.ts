function createUniqueId(usedIds: Set<number>): number {
  let id = Math.floor(Math.random() * 1_000_000);

  while (usedIds.has(id)) {
    id = Math.floor(Math.random() * 1_000_000);
  }

  usedIds.add(id);
  return id;
}
const usedIds = new Set<number>();
export { usedIds, createUniqueId };
