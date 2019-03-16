export interface SchematicSchema {
  $schema: string;
  properties: {
    [key: string]: { default: string | number | boolean };
  };
}
