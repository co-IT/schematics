import { CompilerOptions } from '../models';
export function readParameterDefaults(schema: any): CompilerOptions {
  return Object.keys(schema.properties).reduce(
    (compilerOptions: CompilerOptions, property) => ({
      ...compilerOptions,
      [property]: schema.properties[property].default
    }),
    {} as CompilerOptions
  );
}
