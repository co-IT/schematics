import { Tree, VirtualTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:commitlint', () => {
  describe('When commitlint is not installed', () => {
    let runner: SchematicTestRunner;
    let treeBefore: Tree;

    beforeEach(() => {
      runner = new SchematicTestRunner('commitlint', collectionPath);
      treeBefore = new UnitTestTree(new VirtualTree());

      const packageBeforeInstall = { scripts: {}, devDependencies: {} };
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
});
