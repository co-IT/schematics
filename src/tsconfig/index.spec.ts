import { SchematicsException, Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { readParameterDefaults } from './test/read-parameter-defaults';
import * as tsconfigSchema from './test/schema.json';
import * as parameterSchema from './tsconfig.schema.json';

import ajv = require('ajv');

describe('@co-it/schematics:tsconfig', () => {
  const schemaValidator = new ajv();
  const parameterDefaults = readParameterDefaults(parameterSchema);
  const collectionPath = join(__dirname, '../collection.json');

  describe('When tsconfig.json is not present', () => {
    it('should fail', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);

      expect(() => runner.runSchematic('tsconfig')).toThrow(
        new SchematicsException(
          'Sorry, no tsconfig.json was found in root directory.'
        )
      );
    });
  });

  describe('When tsconfig.json is present', () => {
    let project: Tree;
    let runner: SchematicTestRunner;
    let tsconfig: any;

    beforeEach(() => {
      project = new UnitTestTree(Tree.empty());
      project.create('tsconfig.json', JSON.stringify({}));

      runner = new SchematicTestRunner('schematics', collectionPath);
    });

    it.each`
      compilerOption          | expected
      ${'strict'}             | ${true}
      ${'noUnusedParameters'} | ${true}
      ${'noUnusedLocals'}     | ${true}
      ${'noImplicitAny'}      | ${true}
    `(
      'should set $compilerOption to default value of schema ($expected)',
      ({ compilerOption: option, expected }) => {
        const tree = runner.runSchematic(
          'tsconfig',
          parameterDefaults,
          project
        );

        tsconfig = JSON.parse(tree.readContent('tsconfig.json'));
        expect(tsconfig.compilerOptions[option]).toBe(expected);
      }
    );

    it.each`
      compilerOption          | passedParameter
      ${'strict'}             | ${false}
      ${'noUnusedParameters'} | ${false}
      ${'noUnusedLocals'}     | ${false}
      ${'noImplicitAny'}      | ${false}
    `(
      'should set $compilerOption to default value of schema ($passedParameter)',
      ({ compilerOption: option, passedParameter }) => {
        const tree = runner.runSchematic(
          'tsconfig',
          { ...parameterDefaults, [option]: passedParameter },
          project
        );

        tsconfig = JSON.parse(tree.readContent('tsconfig.json'));
        expect(tsconfig.compilerOptions[option]).toBe(passedParameter);
      }
    );

    afterEach(done => {
      if (schemaValidator.validate(tsconfigSchema, tsconfig)) {
        done();
      } else {
        done.fail(schemaValidator.errors!.join('\n'));
      }
    });
  });
});
