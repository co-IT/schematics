export interface SchematicSchema {
  $schema: string;
  properties: {
    [key: string]: { description: string; default?: string | number | boolean };
  };
}
