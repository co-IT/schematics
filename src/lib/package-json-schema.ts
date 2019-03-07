export interface PackageJsonSchema {
  devDependencies: {
    [key: string]: string;
  };
  scripts: {
    [key: string]: string;
  };
}
