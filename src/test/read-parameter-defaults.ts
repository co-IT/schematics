export function readParameterDefaults<T>(schema: any): T {
  return Object.keys(schema.properties).reduce(
    (defaults: T, property) => ({
      ...defaults,
      [property]: schema.properties[property].default
    }),
    {} as T
  );
}
