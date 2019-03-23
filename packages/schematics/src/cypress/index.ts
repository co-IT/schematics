import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain,
  mergeWith,
  apply,
  url,
  template
} from '@angular-devkit/schematics';
import { CypressSchematicOptions } from './model';
import { AngularJson } from '../lib/angular-json';
import { installDependencies } from '../lib';
import { strings } from '@angular-devkit/core';
import { AngularJsonProject } from '../lib/angular-json-project';

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
      configureAngularJson(patchedOptions, angularJson),
      overwriteAppFolderWithCypressFiles(patchedOptions, angularJson)
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
    const e2eAppName = getE2eProjectNameForApp(options.app);

    const root = options.overwrite
      ? angularJson.getApp(e2eAppName).root
      : calculateRootFolderFromTargetApp(options, angularJson);

    const newAppConfiguration: AngularJsonProject = createCypressProjectConfiguration(
      root,
      options.app
    );

    if (!options.overwrite) {
      tree.getDir(newAppConfiguration.root).visit(() => {
        // tree.exists is false for directories, so I didn't
        // find another way to check if directory is empty...
        throw new SchematicsException(
          `Could not create root folder "${
            newAppConfiguration.root
          }" because it is not empty.`
        );
      });
    }

    angularJson.setApp(e2eAppName, newAppConfiguration);

    tree.overwrite('angular.json', angularJson.stringify());
    return tree;
  };
}

function calculateRootFolderFromTargetApp(
  options: CypressSchematicOptions,
  angularJson: AngularJson
) {
  if (options.folder) {
    return options.folder;
  }

  const targetAppRoot = angularJson.getApp(options.app).root;
  const sanitizedTargetAppRoot = targetAppRoot.endsWith('/')
    ? targetAppRoot
    : `${targetAppRoot}/`;
  if (sanitizedTargetAppRoot === '/') {
    return `${getE2eProjectNameForApp(options.app)}/`;
  }

  const pathSegments = sanitizedTargetAppRoot.split('/');
  pathSegments[pathSegments.length - 2] = getE2eProjectNameForApp(options.app);
  return pathSegments.join('/');
}

function createCypressProjectConfiguration(
  root: string,
  nameOfAppUnderTest: string
): AngularJsonProject {
  const sanitizedRoot = root.endsWith('/') ? root : `${root}/`;
  return {
    root: sanitizedRoot,
    projectType: 'application',
    prefix: '',
    architect: {
      e2e: {
        builder: '@nrwl/builders:cypress',
        options: {
          cypressConfig: `${sanitizedRoot}cypress.json`,
          tsConfig: `${sanitizedRoot}tsconfig.e2e.json`,
          devServerTarget: `${nameOfAppUnderTest}:serve`
        },
        configurations: {
          production: {
            devServerTarget: `${nameOfAppUnderTest}:serve:production`
          }
        }
      },
      lint: {
        builder: '@angular-devkit/build-angular:tslint',
        options: {
          tsConfig: `${sanitizedRoot}tsconfig.e2e.json`,
          exclude: ['**/node_modules/**']
        }
      }
    }
  };
}

function overwriteAppFolderWithCypressFiles(
  options: CypressSchematicOptions,
  angularJson: AngularJson
): Rule {
  return (_tree: Tree) => {
    const e2eProjectName = getE2eProjectNameForApp(options.app);

    const root = angularJson.getRootPathFor(e2eProjectName);

    _tree.getDir(root).visit(oldFile => {
      _tree.delete(oldFile);
    });

    const dotsUp = root.replace(/[^/]+/g, '..');
    const tsOutDir = `${dotsUp}dist/out-tsc/apps/${e2eProjectName}`;
    const tsExtends = `${dotsUp}tsconfig.json`;

    return mergeWith(
      apply(url('./templates/cypress-initial'), [
        template({
          ...strings,
          root,
          tsOutDir,
          tsExtends
        })
      ])
    );
  };
}

function getE2eProjectNameForApp(appName: string) {
  return `${appName}-e2e`;
}
