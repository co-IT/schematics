import { AngularJsonProject } from './angular-json-project';

export interface AngularJsonSchema {
  readonly projects: {
    [key: string]: AngularJsonProject;
  };
  readonly defaultProject: string;
}
