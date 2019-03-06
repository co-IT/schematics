import { Tree, VirtualTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:prettier', () => {
  describe('When prettier is not installed', () => {
    let runner: SchematicTestRunner;
    let actualTree: Tree;

    beforeEach(() => {
      runner = new SchematicTestRunner('prettier', collectionPath);
      actualTree = new UnitTestTree(new VirtualTree());
    });

    it('should add prettier to the devDependencies', () => {
      const packageBeforeInstall = { devDependencies: {} };
      actualTree.create('package.json', JSON.stringify(packageBeforeInstall));

      const tree = runner.runSchematic('prettier', {}, actualTree);

      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));

      expect(packageAfterInstall.devDependencies).toHaveProperty('prettier');
    });
  });
});
