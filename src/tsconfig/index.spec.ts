import { SchematicsException } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('@co-it/schematics:tsconfig', () => {
  describe('When no root tsconfig.json is present', () => {
    it('should fail', () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);

      expect(() => runner.runSchematic('tsconfig')).toThrow(
        new SchematicsException(
          'Sorry, no tsconfig.json was found in root directory.'
        )
      );
    });
  });
});
