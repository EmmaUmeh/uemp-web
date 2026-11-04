function hasKey(value: unknown, key: string): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && key in value;
}

export function unwrap<T>(body: unknown): T {
  return (hasKey(body, 'data') ? body.data : body) as T;
}

export function unwrapList<T>(body: unknown): T[] {
  const inner = unwrap<unknown>(body);
  if (Array.isArray(inner)) return inner as T[];
  if (hasKey(inner, 'items') && Array.isArray(inner.items)) return inner.items as T[];
  if (hasKey(inner, 'data') && Array.isArray(inner.data)) return inner.data as T[];
  if (typeof inner === 'object' && inner !== null) {
    const collections = Object.values(inner).filter(Array.isArray);
    if (collections.length === 1) return collections[0] as T[];
  }
  throw new Error('The server returned an invalid list response.');
}
