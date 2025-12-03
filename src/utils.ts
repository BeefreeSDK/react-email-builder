const isPlainObject = (value: unknown): value is object => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
)

/**
 * Deep merges two objects, recursively merging nested objects.
 * Arrays and other non-plain objects are replaced rather than merged.
 */
export const deepMerge = <T extends object>(
  target: T,
  source: Partial<T>,
): T => {
  const output = { ...target }

  for (const key in source) {
    if (!source.hasOwnProperty(key)) continue

    const sourceValue = source[key]
    const targetValue = (output as Record<string, unknown>)[key]

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      (output as Record<string, unknown>)[key] = deepMerge(targetValue, sourceValue as Partial<object>)
    }
    else {
      (output as Record<string, unknown>)[key] = sourceValue
    }
  }

  return output
}
