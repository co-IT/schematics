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

  describe('When package.json does not contain an entry scripts', () => {
    it('should create the entry', () => {
      const buffer = Buffer.from(JSON.stringify({ devDependencies: {} }));
      const packageJson = new PackageJson(buffer);

      packageJson.setScript('test', 'jest');

      expect(packageJson.stringify()).toContain('"scripts":');
    });
  });

  describe('When package.json does not contain an entry devDependencies', () => {
    it('should create the entry', () => {
      const buffer = Buffer.from(JSON.stringify({ scripts: {} }));
      const packageJson = new PackageJson(buffer);

      packageJson.setDevDependency('prettier', '~1.16.0');

      expect(packageJson.stringify()).toContain('"devDependencies":');
    });
  });

  describe('When package.json is valid', () => {
    it('should allow setting scripts', () => {
      const buffer = Buffer.from(JSON.stringify({}));
      const packageJson = new PackageJson(buffer);
      packageJson.setScript('test', 'jest');

      expect(packageJson.stringify()).toContain('"test": "jest"');
    });

    it('should allow setting devDependencies', () => {
      const buffer = Buffer.from(JSON.stringify({}));
      const packageJson = new PackageJson(buffer);
      packageJson.setDevDependency('prettier', '~1.16.0');

      expect(packageJson.stringify()).toContain('"prettier": "~1.16.0"');
    });
  });
});
