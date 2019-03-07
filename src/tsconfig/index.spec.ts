import { EmptyTree, SchematicsException } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('@co-it/schematics:tsconfig', () => {
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
    it('should should set "strict: true"', () => {
      const project = new UnitTestTree(new EmptyTree());
      project.create('tsconfig.json', JSON.stringify({}));
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = runner.runSchematic('tsconfig', {}, project);
      const tsconfig = JSON.parse(tree.readContent('tsconfig.json'));

      expect(tsconfig.compilerOptions.strict).toBe(true);
    });
  });
});
