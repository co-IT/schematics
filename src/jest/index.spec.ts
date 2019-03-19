import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:jest', () => {
  let runner: SchematicTestRunner;
  let actualTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('jest', collectionPath);
    actualTree = new UnitTestTree(Tree.empty());

    const packageBeforeInstall = { scripts: {}, devDependencies: {} };
    actualTree.create('package.json', JSON.stringify(packageBeforeInstall));
  });

  describe('when jest is not installed', () => {
    it.each([['jest'], ['jest-preset-angular']])(
      'should add %p to devDependencies',
      (packageId: string) => {
        const tree = runner.runSchematic('jest', {}, actualTree);

        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies).toEqual(
          expect.objectContaining({ [packageId]: expect.anything() })
        );
      }
    );
  });
});
