import { CypressSchematicOptions } from '../model';
import { AngularJson } from 'src/lib/angular-json';
import { Tree, Rule, SchematicsException } from '@angular-devkit/schematics';
import { getE2eProjectNameForApp } from './utils';

export function verifyOptions(
  options: CypressSchematicOptions,
  angularJson: AngularJson
): Rule {
  return (tree: Tree, context: any) => {
    console.log(context);

    if (!angularJson.hasApp(options.app)) {
      throw new SchematicsException(
        'Invalid app name provided. ' +
          'Please provide a name of an existing Angular app as configured in angular.json.'
      );
    }

    const doesE2eAppExist = angularJson.hasApp(
      getE2eProjectNameForApp(options.app)
    );

    if (doesE2eAppExist && !options.overwrite) {
      throw new SchematicsException(
        `Existing project named "${options.app}-e2e" was found. ` +
          'Please set --overwrite to true to overwrite existing project.'
      );
    }

    if (!doesE2eAppExist && options.overwrite) {
      throw new SchematicsException(
        `No e2e project named "${options.app}-e2e" was found. ` +
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

    return tree;
  };
}
