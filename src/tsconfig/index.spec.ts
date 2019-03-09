import { EmptyTree, SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { CompilerOptions } from './models';
import * as tsconfigSchema from './test/schema.json';
import * as parameterSchema from './tsconfig.schema.json';

import ajv = require('ajv');

const collectionPath = join(__dirname, '../collection.json');

describe('@co-it/schematics:tsconfig', () => {
  const schemaValidator = new ajv();

  const parameterDefaults: CompilerOptions = {
    strict: parameterSchema.properties.strict.default,
    noUnusedLocals: parameterSchema.properties.noUnusedLocals.default,
    noUnusedParameters: parameterSchema.properties.noUnusedParameters.default,
    noImplicitAny: parameterSchema.properties.noImplicitAny.default
  };

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
      project = new UnitTestTree(new EmptyTree());
      project.create('tsconfig.json', JSON.stringify({}));

      runner = new SchematicTestRunner('schematics', collectionPath);
    });

    it('should should set "strict: true"', () => {
      const tree = runner.runSchematic('tsconfig', parameterDefaults, project);

      tsconfig = JSON.parse(tree.readContent('tsconfig.json'));

      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should should set "noUnusedParameters: true"', () => {
      const tree = runner.runSchematic('tsconfig', parameterDefaults, project);

      tsconfig = JSON.parse(tree.readContent('tsconfig.json'));

      expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    });

    it('should should set "noUnusedParameters: true"', () => {
      const tree = runner.runSchematic('tsconfig', parameterDefaults, project);

      tsconfig = JSON.parse(tree.readContent('tsconfig.json'));

      expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
    });

    it('should should set "noImplicitAny: true"', () => {
      const tree = runner.runSchematic('tsconfig', parameterDefaults, project);

      tsconfig = JSON.parse(tree.readContent('tsconfig.json'));

      expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
    });

    afterEach(done => {
      if (schemaValidator.validate(tsconfigSchema, tsconfig)) {
        done();
      } else {
        done.fail(schemaValidator.errors!.join('\n'));
      }
    });
  });
});
