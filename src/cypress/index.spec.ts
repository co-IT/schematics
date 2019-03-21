import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { readParameterDefaults } from '../test';
import { CypressSchematicOptions } from './model';

import * as cypressSchema from './cypress.schema.json';

const collectionPath = path.join(__dirname, '../collection.json');
const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('@co-it/schematics:cypress', () => {
  let treeBefore: UnitTestTree;
  let runner: SchematicTestRunner;

  beforeEach(() => {
    treeBefore = new UnitTestTree(Tree.empty());
    treeBefore.create(
      'angular.json',
      JSON.stringify({
        projects: {
          'my-app': {
            projectType: 'application',
            architect: {}
          },
          'my-app-e2e': {
            projectType: 'application',
            architect: { e2e: {} }
          },
          'app-without-e2e-tests': {
            projectType: 'application',
            architect: {}
          }
        },
        defaultProject: 'my-app'
      })
    );
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  describe('When invalid schematics parameters are provided', () => {
    beforeEach(() => {});

    it('should throw an error if app name is invalid', () => {
      const parameters = {
        ...defaultParameters,
        app: 'not-existing'
      };

      expect(() =>
        runner.runSchematic('cypress', parameters, treeBefore)
      ).toThrowError(
        'Invalid app name provided. ' +
          'Please provide a name of an existing Angular app as configured in angular.json.'
      );
    });

    describe('with --overwrite=false', () => {
      it('should throw an error if e2e project is found for specified app', () => {
        const parameters = {
          ...defaultParameters,
          app: 'my-app'
        };

        expect(() =>
          runner.runSchematic('cypress', parameters, treeBefore)
        ).toThrowError(
          'Existing project named "my-app-e2e" was found. ' +
            'Please set --overwrite to true to overwrite existing project.'
        );
      });

      it('should throw an error if e2e project is found for default project', () => {
        const parameters = defaultParameters;

        expect(() =>
          runner.runSchematic('cypress', parameters, treeBefore)
        ).toThrowError(
          'Existing project named "my-app-e2e" was found. ' +
            'Please set --overwrite to true to overwrite existing project.'
        );
      });
    });

    describe('with --overwrite=true', () => {
      it('should throw an error if e2e project to be overwritten is not found', () => {
        const parameters = {
          ...defaultParameters,
          app: 'app-without-e2e-tests',
          overwrite: true
        };

        expect(() =>
          runner.runSchematic('cypress', parameters, treeBefore)
        ).toThrowError(
          'No e2e project named "app-without-e2e-tests-e2e" was found. ' +
            'If you want to create a new e2e project, please set --overwrite to false ' +
            ' and provide a root folder via --folder.'
        );
      });

      it('should throw an error if --folder is set', () => {
        const parameters = {
          ...defaultParameters,
          app: 'my-app',
          overwrite: true,
          folder: 'some-folder'
        };

        expect(() =>
          runner.runSchematic('cypress', parameters, treeBefore)
        ).toThrowError(
          'Parameters --overwrite and --folder are mutually exclusive. ' +
            'Original root folder is used when overwriting an existing e2e project.'
        );
      });
    });
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
        const parameters = {
          ...defaultParameters,
          app: 'app-without-e2e-tests'
        };

        console.log(treeBefore.files);
        const tree = runner.runSchematic('cypress', parameters, treeBefore);

        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies).toEqual(
          expect.objectContaining({ [packageId]: expect.anything() })
        );
      }
    );
  });
});
