import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { AngularJson, AngularJsonProject } from 'src/lib';
import { CypressSchematicOptions } from '../model';
import { getE2eProjectNameForApp, readAngularJson } from './utils';

export function configureAngularJson(options: CypressSchematicOptions): Rule {
  return (tree: Tree) => {
    const ngConfig = readAngularJson(tree);
    const e2eAppName = getE2eProjectNameForApp(options.app);

    const root = options.overwrite
      ? ngConfig.getApp(e2eAppName).root
      : calculateRootFolderFromTargetApp(options, ngConfig);

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

    ngConfig.setApp(e2eAppName, newAppConfiguration);

    tree.overwrite('angular.json', ngConfig.stringify());
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
