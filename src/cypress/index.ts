import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain
} from '@angular-devkit/schematics';
import { CypressSchematicOptions } from './model';
import { AngularJson } from '../lib/angular-json';

export default function cypress(options: CypressSchematicOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularJson = readAngularJson(tree);

    return chain([verifyOptions(options, angularJson)]);
  };
}

function readAngularJson(tree: Tree): AngularJson {
  const angularJsonBuffer = tree.read('angular.json')!;
  const angularJson = new AngularJson(angularJsonBuffer);
  return angularJson;
}

function verifyOptions(
  options: CypressSchematicOptions,
  angularJson: AngularJson
): Rule {
  return (tree: Tree) => {
    const appName = options.app || angularJson.defaultProject;

    if (!angularJson.hasApp(appName)) {
      throw new SchematicsException(
        'Invalid app name provided. ' +
          'Please provide a name of an existing Angular app as configured in angular.json.'
      );
    }

    if (!options.overwrite && angularJson.hasApp(`${appName}-e2e`)) {
      throw new SchematicsException(
        `Existing project named "${appName}-e2e" was found. ` +
          'Please set --overwrite to true to overwrite existing project.'
      );
    }

    if (options.overwrite && !angularJson.hasApp(`${appName}-e2e`)) {
      throw new SchematicsException(
        `No e2e project named "${appName}-e2e" was found. ` +
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
