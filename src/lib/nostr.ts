export function getTagValue(
  tagName: string,
  tags: string[][]
): string | undefined {
  return tags.find((tag) => tag[0] === tagName)?.[1];
}

export function toDate(createdAt: number): Date {
  return new Date(createdAt * 1000);
}
