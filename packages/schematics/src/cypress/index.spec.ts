import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { readParameterDefaults } from '../test';
import { CypressSchematicOptions } from './model';

import * as cypressSchema from './cypress.schema.json';
import { PackageJsonSchema } from 'src/lib/package-json-schema';

const collectionPath = path.join(__dirname, '../collection.json');
const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('@co-it/schematics:cypress', () => {
  let treeBefore: UnitTestTree;
  let runner: SchematicTestRunner;

  beforeEach(() => {
    treeBefore = new UnitTestTree(Tree.empty());
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  describe('When schematic parameters are valid', () => {
    beforeEach(() => {
      treeBefore.create(
        'package.json',
        JSON.stringify({ scripts: {}, devDependencies: {} })
      );
    });

    it.each([['cypress'], ['@nrwl/builders']])(
      'should install %s',
      packageId => {
        treeBefore.create('e2e/.keep', '');
        treeBefore.create(
          'angular.json',
          JSON.stringify({
            projects: {
              'my-app': {
                projectType: 'application',
                architect: {}
              },
              'my-app-e2e': {
                root: 'e2e/',
                projectType: 'application',
                architect: { e2e: { options: {} } }
              }
            }
          })
        );

        const parameters = {
          ...defaultParameters,
          app: 'my-app',
          overwrite: true
        };

        const tree = runner.runSchematic('cypress', parameters, treeBefore);

        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies).toEqual(
          expect.objectContaining({ [packageId]: expect.anything() })
        );
      }
    );

    describe('When user wants to overwrite project files in /e2e folder', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app',
        overwrite: true
      };

      beforeEach(() => {
        treeBefore.create('e2e/.keep', '');
        treeBefore.create(
          'angular.json',
          JSON.stringify({
            projects: {
              'my-app': {
                projectType: 'application',
                architect: {}
              },
              'my-app-e2e': {
                root: 'e2e/',
                projectType: 'application',
                prefix: '',
                architect: {}
              }
            }
          })
        );
      });

      it('should copy initial cypress files to app root folder', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );

        expect(treeAfter.files.filter(f => f.startsWith('/e2e'))).toEqual([
          '/e2e/cypress.json',
          '/e2e/tsconfig.e2e.json',
          '/e2e/tsconfig.json',
          '/e2e/src/fixtures/example.json',
          '/e2e/src/integration/examples/app.spec.ts',
          '/e2e/src/plugins/index.ts',
          '/e2e/src/support/commands.ts',
          '/e2e/src/support/index.ts'
        ]);
      });

      it('should set correct outDir compiler option in tsconfig.e2e.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const tsConfigE2eJson = JSON.parse(
          treeAfter.readContent('/e2e/tsconfig.e2e.json')
        );
        expect(tsConfigE2eJson.compilerOptions.outDir).toEqual(
          '../dist/out-tsc/apps/my-app-e2e/src'
        );
      });

      it('should set correct extends option in tsconfig.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const tsConfigJson = JSON.parse(
          treeAfter.readContent('/e2e/tsconfig.json')
        );
        expect(tsConfigJson.extends).toEqual('../tsconfig.json');
      });

      it('should use correct directories in cypress.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const cypressJson = JSON.parse(
          treeAfter.readContent('/e2e/cypress.json')
        );
        expect(cypressJson).toEqual(
          expect.objectContaining({
            fileServerFolder: '../dist/out-tsc/apps/my-app-e2e',
            fixturesFolder: '../dist/out-tsc/apps/my-app-e2e/src/fixtures',
            integrationFolder:
              '../dist/out-tsc/apps/my-app-e2e/src/integration',
            pluginsFile: '../dist/out-tsc/apps/my-app-e2e/src/plugins/index.js',
            videosFolder: '../dist/out-tsc/apps/my-app-e2e/videos',
            screenshotsFolder: '../dist/out-tsc/apps/my-app-e2e/screenshots'
          })
        );
      });
    });

    describe('When user wants to overwrite project files in /projects/app-e2e folder', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app',
        overwrite: true
      };

      beforeEach(() => {
        treeBefore.create('project/app-e2e/.keep', '');
        treeBefore.create(
          'angular.json',
          JSON.stringify({
            projects: {
              'my-app': {
                projectType: 'application',
                architect: {}
              },
              'my-app-e2e': {
                root: 'projects/app-e2e/',
                projectType: 'application',
                prefix: '',
                architect: {
                  e2e: {}
                }
              }
            }
          })
        );
      });

      it('should set correct outDir compiler option in tsconfig.e2e.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const tsConfigE2eJson = JSON.parse(
          treeAfter.readContent('/projects/app-e2e/tsconfig.e2e.json')
        );
        expect(tsConfigE2eJson.compilerOptions.outDir).toEqual(
          '../../dist/out-tsc/apps/my-app-e2e/src'
        );
      });

      it('should set correct extends option in tsconfig.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const tsConfigJson = JSON.parse(
          treeAfter.readContent('/projects/app-e2e/tsconfig.json')
        );
        expect(tsConfigJson.extends).toEqual('../../tsconfig.json');
      });

      it('should use correct directories in cypress.json', () => {
        const treeAfter = runner.runSchematic(
          'cypress',
          parameters,
          treeBefore
        );
        const cypressJson = JSON.parse(
          treeAfter.readContent('/projects/app-e2e/cypress.json')
        );
        expect(cypressJson).toEqual(
          expect.objectContaining({
            fileServerFolder: '../../dist/out-tsc/apps/my-app-e2e',
            fixturesFolder: '../../dist/out-tsc/apps/my-app-e2e/src/fixtures',
            integrationFolder:
              '../../dist/out-tsc/apps/my-app-e2e/src/integration',
            pluginsFile:
              '../../dist/out-tsc/apps/my-app-e2e/src/plugins/index.js',
            videosFolder: '../../dist/out-tsc/apps/my-app-e2e/videos',
            screenshotsFolder: '../../dist/out-tsc/apps/my-app-e2e/screenshots'
          })
        );
      });
    });

    it('should set an npm script for cypress open', () => {
      treeBefore.create('e2e/.keep', '');
      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              projectType: 'application',
              architect: {}
            },
            'my-app-e2e': {
              root: 'e2e/',
              projectType: 'application',
              architect: { e2e: { options: {} } }
            }
          }
        })
      );

      const parameters = {
        ...defaultParameters,
        app: 'my-app',
        overwrite: true
      };

      const tree = runner.runSchematic('cypress', parameters, treeBefore);

      const packageJson: PackageJsonSchema = JSON.parse(
        tree.readContent('package.json')
      );

      expect(packageJson.scripts).toEqual({ 'cy:open': 'cypress open' });
    });
  });
});
