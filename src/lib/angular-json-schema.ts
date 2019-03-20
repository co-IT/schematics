export interface AngularJsonSchema {
  readonly projects: {
    [key: string]: {
      sourceRoot: string;
      projectType: 'application' | 'library';
      architect: {
        e2e?: any;
      };
    };
  };
  readonly defaultProject: string;
}
