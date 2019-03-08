export interface PackageJsonSchema {
  devDependencies: {
    [key: string]: string;
  };
  scripts: {
    [key: string]: string;
  };
  husky?: {
    hooks: {
      [key: string]: string;
    };
  };
}
