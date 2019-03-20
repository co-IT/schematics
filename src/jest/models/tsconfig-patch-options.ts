export interface TsconfigPatchOptions {
  compilerOptions: {
    types: string[];
    module: string;
  };
  files: string[];
}
