import { SchematicsException } from '@angular-devkit/schematics';
import { PackageJson } from './package-json';

describe('PackageJson', () => {
  describe('When package.json has no content', () => {
    it('should raise an error', () => {
      expect(() => new PackageJson(null)).toThrow(
        new SchematicsException('Sorry, package.json file could not be found.')
      );
    });
  });
});
