import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { readParameterDefaults } from '../../test';
import * as cypressSchema from '../cypress.schema.json';
import { CypressSchematicOptions } from '../model';
import { configureAngularJson } from './configure-angular-json';

const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('configureAngularJson', () => {
  let treeBefore: UnitTestTree;

  beforeEach(() => {
    treeBefore = new UnitTestTree(Tree.empty());
  });

  describe('When --overwrite=true is set', () => {
    const parameters = {
      ...defaultParameters,
      app: 'my-app',
      overwrite: true
    };

    it('should configure project entry in angular.json', () => {
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

      const treeAfter = configureAngularJson(parameters)(
        treeBefore,
        null!
      ) as UnitTestTree;

      const angularJson = JSON.parse(treeAfter.readContent('angular.json'));

      expect(angularJson.projects['my-app-e2e']).toEqual({
        root: 'e2e/',
        projectType: 'application',
        prefix: '',
        architect: {
          e2e: {
            builder: '@nrwl/builders:cypress',
            options: {
              cypressConfig: 'e2e/cypress.json',
              tsConfig: 'e2e/tsconfig.e2e.json',
              devServerTarget: 'my-app:serve'
            },
            configurations: {
              production: {
                devServerTarget: 'my-app:serve:production'
              }
            }
          },
          lint: {
            builder: '@angular-devkit/build-angular:tslint',
            options: {
              tsConfig: 'e2e/tsconfig.e2e.json',
              exclude: ['**/node_modules/**']
            }
          }
        }
      });
    });
  });

  describe('When user wants to create new e2e project', () => {
    it.each`
      root                 | expected
      ${''}                | ${'my-app-e2e/'}
      ${'/'}               | ${'my-app-e2e/'}
      ${'my-app/'}         | ${'my-app-e2e/'}
      ${'projects/my-app'} | ${'projects/my-app-e2e/'}
    `(
      'should set e2e project root to "%expected" in angular.json for app with root "%root"',
      ({ root, expected }: { root: string; expected: string }) => {
        const parameters = {
          ...defaultParameters,
          app: 'my-app'
        };

        treeBefore.create(
          'angular.json',
          JSON.stringify({
            projects: {
              'my-app': {
                root,
                projectType: 'application',
                architect: {}
              }
            }
          })
        );

        const tree = configureAngularJson(parameters)(
          treeBefore,
          null!
        ) as UnitTestTree;

        const angularJson = JSON.parse(tree.readContent('angular.json'));

        expect(angularJson.projects['my-app-e2e'].root).toEqual(expected);
      }
    );

    it('should respect folder parameter', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app',
        folder: 'some/folder'
      };

      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              root: '',
              projectType: 'application',
              architect: {}
            }
          }
        })
      );
      const tree = configureAngularJson(parameters)(
        treeBefore,
        null!
      ) as UnitTestTree;

      const angularJson = JSON.parse(tree.readContent('angular.json'));

      expect(angularJson.projects['my-app-e2e'].root).toEqual('some/folder/');
    });

    it('should throw an exception if new root folder already exists', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app'
      };

      treeBefore.create('my-app-e2e', '');
      treeBefore.create('my-app-e2e/.keep', '');
      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              root: '',
              projectType: 'application',
              architect: {}
            }
          }
        })
      );

      expect(() =>
        configureAngularJson(parameters)(treeBefore, null!)
      ).toThrowError(
        'Could not create root folder "my-app-e2e/" because it is not empty.'
      );
    });
  });
});
