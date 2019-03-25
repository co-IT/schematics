import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { CypressSchematicOptions } from '../model';
import { getE2eProjectNameForApp, readAngularJson } from './utils';

export function verifyOptions(
  options: CypressSchematicOptions,
  tree: Tree
): CypressSchematicOptions {
  const angularJson = readAngularJson(tree);

  const app = options.app || angularJson.defaultProject;

  if (!angularJson.hasApp(app)) {
    throw new SchematicsException(
      'Invalid app name provided. ' +
        'Please provide a name of an existing Angular app as configured in angular.json.'
    );
  }

  const doesE2eAppExist = angularJson.hasApp(getE2eProjectNameForApp(app));

  if (doesE2eAppExist && !options.overwrite) {
    throw new SchematicsException(
      `Existing project named "${app}-e2e" was found. ` +
        'Please set --overwrite to true to overwrite existing project.'
    );
  }

  if (!doesE2eAppExist && options.overwrite) {
    throw new SchematicsException(
      `No e2e project named "${app}-e2e" was found. ` +
        'If you want to create a new e2e project, please set --overwrite to false ' +
        ' and provide a root folder via --folder.'
    );
  }

  if (options.folder && options.overwrite) {
    throw new SchematicsException(
      'Parameters --overwrite and --folder are mutually exclusive. ' +
        'Original root folder is used when overwriting an existing e2e project.'
    );
  }

  return { ...options, app };
}
