import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain
} from '@angular-devkit/schematics';
import { CypressSchematicOptions } from './model';
import { AngularJson } from '../lib/angular-json';
import { installDependencies } from '../lib';

export default function cypress(options: CypressSchematicOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularJson = readAngularJson(tree);
    const patchedOptions = {
      ...options,
      app: options.app || angularJson.defaultProject
    };

    return chain([
      verifyOptions(patchedOptions, angularJson),
      installDependencies({
        devDependencies: ['cypress', '@nrwl/builders']
      }),
      configureAngularJson(patchedOptions, angularJson)
    ]);
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

function configureAngularJson(
  options: CypressSchematicOptions,
  angularJson: AngularJson
): Rule {
  return (tree: Tree) => {
    angularJson.setCypressConfigFor(getE2eProjectNameForApp(options.app));
    tree.overwrite('angular.json', angularJson.stringify());
    return tree;
  };
}

function getE2eProjectNameForApp(appName: string) {
  return `${appName}-e2e`;
}
