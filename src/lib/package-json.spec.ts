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
      const packageJson = new PackageJson(toBuffer({ devDependencies: {} }));

      packageJson.setScript('test', 'jest');

      expect(packageJson.stringify()).toContain('"scripts":');
    });
  });

  describe('When package.json does not contain an entry devDependencies', () => {
    it('should create the entry', () => {
      const packageJson = new PackageJson(toBuffer({ scripts: {} }));

      packageJson.setDevDependency('prettier', '~1.16.0');

      expect(packageJson.stringify()).toContain('"devDependencies":');
    });
  });

  describe('When package.json is valid', () => {
    it('should allow setting scripts', () => {
      const packageJson = new PackageJson(toBuffer({}));
      packageJson.setScript('test', 'jest');

      expect(packageJson.stringify()).toContain('"test": "jest"');
    });

    it('should place a script in the scripts section', () => {
      const packageJson = new PackageJson(toBuffer({}));
      packageJson.setScript('test', 'jest');

      expect(JSON.parse(packageJson.stringify())).toMatchObject({
        scripts: { test: 'jest' }
      });
    });

    it('should allow setting devDependencies', () => {
      const packageJson = new PackageJson(toBuffer({}));
      packageJson.setDevDependency('prettier', '~1.16.0');

      expect(packageJson.stringify()).toContain('"prettier": "~1.16.0"');
    });
  });
});

function toBuffer(value: object): Buffer {
  return Buffer.from(JSON.stringify(value));
}
