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
});
