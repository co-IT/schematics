import { AngularJson } from '../../lib';
import { readParameterDefaults } from '../../test';
import * as cypressSchema from '../cypress.schema.json';
import { CypressSchematicOptions } from '../model';
import { verifyOptions } from './verify-options';

const defaultParameters = readParameterDefaults<CypressSchematicOptions>(
  cypressSchema
);

describe('verify-options', () => {
  it('should throw an error if app name is invalid', () => {
    const parameters = {
      ...defaultParameters,
      app: 'not-existing'
    };

    const angularJson = { hasApp: _x => false } as AngularJson;

    expect(() =>
      verifyOptions(parameters, angularJson)(null!, null!)
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

      const angularJson = { hasApp: _x => true } as AngularJson;

      expect(() =>
        verifyOptions(parameters, angularJson)(null!, null!)
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

      const angularJson = {
        hasApp: name => name === 'app-without-e2e-tests'
      } as AngularJson;

      expect(() =>
        verifyOptions(parameters, angularJson)(null!, null!)
      ).toThrowError(
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

      const angularJson = { hasApp: _x => true } as AngularJson;

      expect(() =>
        verifyOptions(parameters, angularJson)(null!, null!)
      ).toThrowError(
        'Parameters --overwrite and --folder are mutually exclusive. ' +
          'Original root folder is used when overwriting an existing e2e project.'
      );
    });
  });
});
