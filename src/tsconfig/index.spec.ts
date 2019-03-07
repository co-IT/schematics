import { EmptyTree, SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { TsConfigSchema } from './tsconfig.schema.js';
import * as schema from './tsconfig.schema.json';

import Ajv = require('ajv');

const collectionPath = join(__dirname, '../collection.json');

describe('@co-it/schematics:tsconfig', () => {
  const parameterDefaults: TsConfigSchema = {
    strict: schema.properties.strict.default,
    noUnusedLocals: schema.properties.noUnusedLocals.default,
    noUnusedParameters: schema.properties.noUnusedParameters.default,
    noImplicitAny: schema.properties.noImplicitAny.default
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
  });
});
