import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:commitlint', () => {
  let runner: SchematicTestRunner;
  let treeBefore: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('commitlint', collectionPath);
    treeBefore = new UnitTestTree(Tree.empty());
  });

  describe('When commitlint is already configured', () => {
    let mockLogger: { warn: () => void };
    let warn: jest.SpyInstance;

    beforeEach(() => {
      mockLogger = { warn: () => {} };
      runner['_logger'] = { createChild: () => mockLogger as any } as any;
      warn = jest.spyOn(mockLogger, 'warn');

      const packageBeforeInstall = {
        scripts: {},
        devDependencies: {}
      };
      treeBefore.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should print a warning', () => {
      treeBefore.create('commitlint.config.js', JSON.stringify({}));
      runner.runSchematic('commitlint', {}, treeBefore);
      expect(warn).toHaveBeenCalledWith(
        'Found competing commitlint configuration in commitlint.config.js.'
      );
    });
  });

  describe('When commitlint is not installed', () => {
    beforeEach(() => {
      const packageBeforeInstall = { devDependencies: {} };
      treeBefore.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should add required devDependencies', () => {
      const treeAfter = runner.runSchematic('commitlint', {}, treeBefore);

      const packageAfterInstall = JSON.parse(
        treeAfter.readContent('package.json')
      );
      expect(packageAfterInstall.devDependencies).toEqual(
        expect.objectContaining({
          '@commitlint/cli': 'latest',
          '@commitlint/config-conventional': 'latest',
          husky: 'latest'
        })
      );
    });

    it('should add an opinionated commitlint configuration ', () => {
      const treeAfter = runner.runSchematic('commitlint', {}, treeBefore);

      expect(treeAfter.files).toContain('/commitlint.config.js');
    });
  });

  describe('When .huskyrc does not exist', () => {
    beforeEach(() => {
      const packageBeforeInstall = { devDependencies: {} };
      treeBefore.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should configure a commit-msg hook in .huskyrc', () => {
      const treeAfter = runner.runSchematic('commitlint', {}, treeBefore);

      const huskyRc = JSON.parse(treeAfter.readContent('.huskyrc'));

      expect(huskyRc).toEqual({
        hooks: {
          'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
        }
      });
    });
  });

  describe('When .huskyrc already exists', () => {
    beforeEach(() => {
      treeBefore.create(
        'package.json',
        JSON.stringify({ devDependencies: {} })
      );
      treeBefore.create(
        '.huskyrc',
        JSON.stringify({ hooks: { 'pre-commit': 'script' } })
      );
    });

    it('should merge commit-msg hook into .huskyrc', () => {
      const treeAfter = runner.runSchematic('commitlint', {}, treeBefore);

      const huskyRc = JSON.parse(treeAfter.readContent('.huskyrc'));

      expect(huskyRc).toEqual({
        hooks: {
          'pre-commit': 'script',
          'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
        }
      });
    });
  });

  describe('When a competing husky configuration is found', () => {
    let mockLogger: { warn: () => void };
    let warn: jest.SpyInstance;

    beforeEach(() => {
      mockLogger = { warn: () => {} };
      runner['_logger'] = { createChild: () => mockLogger as any } as any;
      warn = jest.spyOn(mockLogger, 'warn');

      const packageBeforeInstall = {
        scripts: {},
        devDependencies: {},
        husky: {}
      };
      treeBefore.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should warn if detected in package.json', () => {
      runner.runSchematic('commitlint', {}, treeBefore);
      expect(warn).toHaveBeenCalledWith(
        'Found competing husky configuration in package.json.'
      );
    });

    it.each([['.huskyrc.json'], ['.huskyrc.js']])(
      ' should warn if detected in %s',
      (file: string) => {
        treeBefore.create(file, JSON.stringify({}));
        runner.runSchematic('commitlint', {}, treeBefore);
        expect(warn).toHaveBeenCalledWith(
          `Found competing husky configuration in ${file}.`
        );
      }
    );
  });
});
