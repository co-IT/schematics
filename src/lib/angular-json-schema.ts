export interface AngularJsonSchema {
  readonly projects: {
    [key: string]: {
      root: string;
      projectType: 'application' | 'library';
      architect: {
        e2e?: any;
      };
    };
  };
  readonly defaultProject: string;
}
