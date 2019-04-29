import { AngularJsonSchema } from './angular-json-schema';
import { SchematicsException } from '@angular-devkit/schematics';
import { AngularJsonProject } from './angular-json-project';

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

  get defaultProject(): string {
    return this.content.defaultProject;
  }

  hasApp(appName: string): boolean {
    return !!this._getApps().find(app => app.name === appName);
  }

  getApp(appName: string) {
    if (!this.hasApp(appName)) {
      throw new SchematicsException(
        `No entry found for application "${appName}"`
      );
    }
    return { ...this.content.projects[appName] };
  }

  setApp(appName: string, appDefinition: AngularJsonProject) {
    this.content.projects[appName] = appDefinition;
  }

  getRootPathFor(appName: string): string {
    return this.content.projects[appName].root;
  }

  setJestConfigFor(testAppName: string) {
    if (!this.hasApp(testAppName)) {
      throw new SchematicsException(`Project "${testAppName}" does not exist.`);
    }
    const projectConfig = this.content.projects[testAppName];
    const projectArchitectConfig = projectConfig.architect;
    if (!projectArchitectConfig.test) {
      throw new SchematicsException(
        `Did not find a test configuration in "${testAppName}".`
      );
    }
    projectArchitectConfig.test.builder = '@angular-builders/jest:run';
    delete projectArchitectConfig.test.options.karmaConfig;
  }

  setCypressConfigFor(e2eAppName: string): void {
    if (!this.hasApp(e2eAppName)) {
      throw new SchematicsException(`Project "${e2eAppName}" does not exist.`);
    }
    const projectConfig = this.content.projects[e2eAppName];
    const projectArchitectConfig = projectConfig.architect;
    if (!projectArchitectConfig.e2e) {
      throw new SchematicsException(
        `Did not find an e2e configuration in "${e2eAppName}".`
      );
    }
    const rootPath = `${projectConfig.root}${
      projectConfig.root.endsWith('/') ? '' : '/'
    }`;
    projectArchitectConfig.e2e.builder = '@nrwl/builders:cypress';
    if (!projectArchitectConfig.e2e.options) {
      projectArchitectConfig.e2e.options = {};
    }
    projectArchitectConfig.e2e.options.cypressConfig = `${rootPath}cypress.json`;
    projectArchitectConfig.e2e.options.tsConfig = `${rootPath}tsconfig.e2e.json`;
    delete projectArchitectConfig.e2e.options.protractorConfig;
  }

  stringify(): string {
    return JSON.stringify(this.content, null, 2);
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
