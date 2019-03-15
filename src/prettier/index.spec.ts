import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { readParameterDefaults } from '../test';
import { PrettierSchematicOptions } from './models';
import * as parameterSchema from './prettier.schema.json';

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

describe('When prettier is already configured', () => {
  let mockLogger: { warn: () => void };
  let runner: SchematicTestRunner;
  let warn: jest.SpyInstance;
  let project: Tree;

  beforeEach(() => {
    mockLogger = { warn: () => {} };
    runner = new SchematicTestRunner('prettier', collectionPath);
    runner['_logger'] = { createChild: () => mockLogger as any } as any;
    warn = jest.spyOn(mockLogger, 'warn');

    project = new UnitTestTree(Tree.empty());

    const packageBeforeInstall = {
      scripts: {},
      devDependencies: {},
      prettier: {}
    };
    project.create('package.json', JSON.stringify(packageBeforeInstall));
  });

  it(' should warn if configuration is detected in package.json', () => {
    runner.runSchematic('prettier', {}, project);
    expect(warn).toHaveBeenCalledWith(
      'Found competing prettier configuration in package.json.'
    );
  });
  it.each([
    ['.prettierrc.yaml'],
    ['.prettierrc.yml'],
    ['.prettierrc.toml'],
    ['.prettierrc.json'],
    ['.prettierrc.js'],
    ['.prettier.config.js']
  ])(' should warn if configuration is detected in %s', (file: string) => {
    project.create(file, JSON.stringify({}));
    runner.runSchematic('prettier', {}, project);
    expect(warn).toHaveBeenCalledWith(
      `Found competing prettier configuration in ${file}.`
    );
  });
});

describe('When the developer wants to use a commit hook', () => {
  let runner: SchematicTestRunner;
  let project: Tree;
  let defaultParameters: PrettierSchematicOptions;

  beforeEach(() => {
    runner = new SchematicTestRunner('prettier', collectionPath);
    project = new UnitTestTree(Tree.empty());
    defaultParameters = readParameterDefaults<PrettierSchematicOptions>(
      parameterSchema
    );

    const packageBeforeInstall = { scripts: {}, devDependencies: {} };
    project.create('package.json', JSON.stringify(packageBeforeInstall));
  });

  it('should install husky', () => {
    const tree = runner.runSchematic('prettier', defaultParameters, project);
    const packageJson = JSON.parse(tree.readContent('package.json'));

    expect(packageJson.devDependencies).toEqual(
      expect.objectContaining({ husky: expect.anything() })
    );
  });

  it('should configure a pre-commit hook in .huskyrc.json', () => {
    const tree = runner.runSchematic('prettier', defaultParameters, project);
    const huskyRc = JSON.parse(tree.readContent('.huskyrc.json'));

    expect(huskyRc.hooks['pre-commit']).toEqual(
      'pretty-quick --staged && lint-staged'
    );
  });
});
