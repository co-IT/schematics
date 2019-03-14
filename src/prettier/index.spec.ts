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
      'should install %s',
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
});

describe('When no prettier configuration is present', () => {
  let runner: SchematicTestRunner;
  let project: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('prettier', collectionPath);
    project = new UnitTestTree(Tree.empty());

    const packageBeforeInstall = { scripts: {}, devDependencies: {} };
    project.create('package.json', JSON.stringify(packageBeforeInstall));
  });

  it('should add .prettierrc', () => {
    const tree = runner.runSchematic('prettier', {}, project);

    expect(tree.exists('.prettierrc')).toBe(true);
  });
});

describe('When .prettierrc is present', () => {
  let runner: SchematicTestRunner;
  let project: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('prettier', collectionPath);
    project = new UnitTestTree(Tree.empty());

    const packageBeforeInstall = { scripts: {}, devDependencies: {} };
    project.create('package.json', JSON.stringify(packageBeforeInstall));
    project.create('.prettierrc', JSON.stringify({}));
  });

  it('should be overridden', () => {
    const tree = runner.runSchematic('prettier', {}, project);
    const prettierrc = JSON.parse(tree.readContent('.prettierrc'));

    expect(prettierrc.printWidth).toBe(80);
  });
});
