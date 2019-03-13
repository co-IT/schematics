import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:prettier', () => {
  describe('When prettier is setup', () => {
    let runner: SchematicTestRunner;
    let actualTree: Tree;

    beforeEach(() => {
      runner = new SchematicTestRunner('prettier', collectionPath);
      actualTree = new UnitTestTree(Tree.empty());

      const packageBeforeInstall = { scripts: {}, devDependencies: {} };
      actualTree.create('package.json', JSON.stringify(packageBeforeInstall));
    });

    it('should register a script executing prettier', () => {
      const tree = runner.runSchematic('prettier', {}, actualTree);
      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));

      expect(packageAfterInstall.scripts.format).toBe(
        'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
      );
    });

    it('should add task for node package installer', () => {
      runner.runSchematic('prettier', {}, actualTree);

      expect(runner.tasks).toContainEqual(
        expect.objectContaining({ name: 'node-package' })
      );
    });

    it.each([['prettier'], ['tslint-config-prettier']])(
      'should install $packageId',
      packageId => {
        const tree = runner.runSchematic('prettier', {}, actualTree);

        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies).toEqual(
          expect.objectContaining({ [packageId]: expect.anything() })
        );
      }
    );

    it('should add tslint-config-prettier to tslint.json', () => {
      actualTree.create(
        'tslint.json',
        JSON.stringify({ extends: 'some-preset' })
      );

      const tree = runner.runSchematic('prettier', {}, actualTree);
      const tslintJson = JSON.parse(tree.readContent('tslint.json'));

      expect(tslintJson.extends).toContain('tslint-config-prettier');
    });
  });

  describe('When no prettier configuration is present', () => {
    it('should add an opinionated prettier configuration ', () => {});
  });
});
