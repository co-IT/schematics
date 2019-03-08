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

  describe('When package.json has no husky entry', () => {
    beforeEach(() => {
      const packageBeforeInstall = { devDependencies: {} };
      treeBefore.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should add an husky entry with commitlint', () => {
      const treeAfter = runner.runSchematic('commitlint', {}, treeBefore);

      const packageAfterInstall = JSON.parse(
        treeAfter.readContent('package.json')
      );

      expect(packageAfterInstall.husky).toEqual({
        hooks: {
          'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
        }
      });
    });
  });
});
