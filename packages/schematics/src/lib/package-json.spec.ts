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

  describe('When package.json does not contain an entry husky', () => {
    it('should create the entry', () => {
      const packageJson = new PackageJson(toBuffer({}));

      packageJson.setHuskyHook('commit-msg', 'commitlint -E HUSKY_GIT_PARAMS');

      expect(packageJson.stringify()).toContain('"husky":');
    });

    it('should allow setting husky hook', () => {
      const packageJson = new PackageJson(toBuffer({}));

      packageJson.setHuskyHook('commit-msg', 'commitlint -E HUSKY_GIT_PARAMS');

      expect(JSON.parse(packageJson.stringify()).husky.hooks).toEqual({
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
      });
    });
  });

  describe('When package.json contains an entry husky', () => {
    it('should allow adding an additional husky hook', () => {
      const packageJson = new PackageJson(
        toBuffer({ husky: { hooks: { 'existing-hook': 'with-command' } } })
      );

      packageJson.setHuskyHook('commit-msg', 'commitlint -E HUSKY_GIT_PARAMS');

      expect(JSON.parse(packageJson.stringify()).husky.hooks).toEqual({
        'existing-hook': 'with-command',
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
      });
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

    it('should allow setting husky hook', () => {
      const packageJson = new PackageJson(toBuffer({}));
      packageJson.setHuskyHook('commit-msg', 'commitlint -E HUSKY_GIT_PARAMS');

      expect(JSON.parse(packageJson.stringify()).husky.hooks).toEqual({
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
      });
    });
  });

  describe('When a package.json has multiple entries', () => {
    it('should preserve the order of keys', () => {
      const packageJson = new PackageJson(
        toBuffer({
          name: '',
          version: '',
          scripts: {},
          devDependencies: {}
        })
      );

      const stringified = packageJson.stringify();
      const parsed = JSON.parse(stringified);

      expect(Object.keys(parsed)[0]).toBe('name');
    });
  });
});

function toBuffer(value: object): Buffer {
  return Buffer.from(JSON.stringify(value));
}
