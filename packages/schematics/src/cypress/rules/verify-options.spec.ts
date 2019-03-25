import { AngularJson, AngularJsonProject } from '../../lib';
import { readParameterDefaults } from '../../test';
import * as cypressSchema from '../cypress.schema.json';
import { CypressSchematicOptions } from '../model';
import { verifyOptions } from './verify-options';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { AngularJsonSchema } from 'src/lib/angular-json-schema';

const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('verify-options', () => {
  let treeBefore: UnitTestTree;

  beforeEach(() => {
    treeBefore = new UnitTestTree(Tree.empty());
  });

  it('should throw an error if app name is invalid', () => {
    const parameters = {
      ...defaultParameters,
      app: 'not-existing'
    };

    treeBefore.create(
      'angular.json',
      JSON.stringify({
        projects: {}
      } as AngularJsonSchema)
    );

    expect(() => verifyOptions(parameters, treeBefore)).toThrowError(
      'Invalid app name provided. ' +
        'Please provide a name of an existing Angular app as configured in angular.json.'
    );
  });

  describe('When valid app name is given', () => {
    it('should return options', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app'
      };

      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              root: '',
              projectType: 'application',
              architect: {}
            } as AngularJsonProject
          }
        })
      );

      expect(verifyOptions(parameters, treeBefore)).toEqual(parameters);
    });
  });

  describe('When no app name is given', () => {
    it('should return sanitized options with defaultProject as app', () => {
      const parameters = {
        ...defaultParameters,
        app: ''
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
          },
          defaultProject: 'my-app'
        } as AngularJsonSchema)
      );

      expect(verifyOptions(parameters, treeBefore)).toEqual({
        ...parameters,
        app: 'my-app'
      });
    });
  });

  describe('When --overwrite=false is used', () => {
    it('should throw an error if e2e project is found for specified app', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app'
      };

      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              root: '',
              projectType: 'application',
              architect: {}
            } as AngularJsonProject,
            'my-app-e2e': {
              root: '',
              projectType: 'application',
              architect: { e2e: {} }
            } as AngularJsonProject
          }
        })
      );

      expect(() => verifyOptions(parameters, treeBefore)).toThrowError(
        'Existing project named "my-app-e2e" was found. ' +
          'Please set --overwrite to true to overwrite existing project.'
      );
    });
  });

  describe('When --overwrite=true is used', () => {
    it('should throw an error if e2e project to be overwritten is not found', () => {
      const parameters = {
        ...defaultParameters,
        app: 'app-without-e2e-tests',
        overwrite: true
      };

      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'app-without-e2e-tests': {
              root: '',
              projectType: 'application',
              architect: {}
            } as AngularJsonProject
          }
        })
      );

      expect(() => verifyOptions(parameters, treeBefore)).toThrowError(
        'No e2e project named "app-without-e2e-tests-e2e" was found. ' +
          'If you want to create a new e2e project, please set --overwrite to false '
      );
    });

    it('should throw an error if --folder is set', () => {
      const parameters = {
        ...defaultParameters,
        app: 'my-app',
        overwrite: true,
        folder: 'some-folder'
      };

      treeBefore.create(
        'angular.json',
        JSON.stringify({
          projects: {
            'my-app': {
              root: '',
              projectType: 'application',
              architect: {}
            } as AngularJsonProject,
            'my-app-e2e': {
              root: '',
              projectType: 'application',
              architect: { e2e: {} }
            } as AngularJsonProject
          }
        })
      );

      expect(() => verifyOptions(parameters, treeBefore)).toThrowError(
        'Parameters --overwrite and --folder are mutually exclusive. ' +
          'Original root folder is used when overwriting an existing e2e project.'
      );
    });
  });
});
