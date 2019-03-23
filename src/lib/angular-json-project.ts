export interface AngularJsonProject {
  root: string;
  projectType: 'application' | 'library';
  architect: {
    [key: string]: any;
  };
  [key: string]: any;
}
