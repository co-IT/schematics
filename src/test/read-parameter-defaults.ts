import { SchematicSchema } from './schema';

export function readParameterDefaults<T>(schema: SchematicSchema): T {
  return Object.keys(schema.properties).reduce(
    (defaults: T, property) => ({
      ...defaults,
      [property]: schema.properties[property].default
    }),
    {} as T
  );
}
