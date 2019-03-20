import { AngularJsonSchema } from './angular-json-schema';
import { SchematicsException } from '@angular-devkit/schematics';

export class AngularJson {
  private content: AngularJsonSchema;

  constructor(buffer: Buffer | undefined | null) {
    if (this._hasNoContent(buffer)) {
      throw new SchematicsException(
        'Sorry, angular.json file could not be found.'
      );
    }
    this.content = JSON.parse(buffer.toString('utf-8'));
  }

  get defaultProject() {
    return this.content.defaultProject;
  }

  hasApp(appName: string): boolean {
    return !!this._getApps().find(app => app.name === appName);
  }

  private _getApps() {
    return Object.getOwnPropertyNames(this.content.projects)
      .filter(
        project => this.content.projects[project].projectType === 'application'
      )
      .map(appName => ({
        name: appName,
        isE2e: !!this.content.projects[appName].architect.e2e
      }));
  }

  private _hasNoContent(
    buffer: Buffer | undefined | null
  ): buffer is undefined | null {
    return !buffer;
  }
}
