import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { readParameterDefaults } from '../test';
import { PrettierSchematicOptions } from './models';
import * as parameterSchema from './prettier.schema.json';

describe('@co-it/schematics:prettier', () => {
  const collectionPath = path.join(__dirname, '../collection.json');

  describe('initial setup', () => {
    describe('When prettier schematic is executed', () => {
      let runner: SchematicTestRunner;
      let project: Tree;

      beforeEach(() => {
        runner = new SchematicTestRunner('prettier', collectionPath);
        project = new UnitTestTree(Tree.empty());

        const packageBeforeInstall = { scripts: {}, devDependencies: {} };
        project.create('package.json', JSON.stringify(packageBeforeInstall));
      });

      it('should register a script executing prettier', () => {
        const tree = runner.runSchematic('prettier', {}, project);
        const packageAfterInstall = JSON.parse(
          tree.readContent('package.json')
        );

        expect(packageAfterInstall.scripts.format).toBe(
          'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
        );
      });

      it('should add task for node package installer', () => {
        runner.runSchematic('prettier', {}, project);

        expect(runner.tasks).toContainEqual(
          expect.objectContaining({ name: 'node-package' })
        );
      });

      it('should add .prettierrc', () => {
        const tree = runner.runSchematic('prettier', {}, project);

        expect(tree.exists('.prettierrc')).toBe(true);
      });

      it('should not add .huskyrc', () => {
        const tree = runner.runSchematic('prettier', { hook: false }, project);

        expect(tree.exists('.huskyrc')).toBe(false);
      });

      it.each([['prettier'], ['tslint-config-prettier']])(
        'should install %s',
        packageId => {
          const tree = runner.runSchematic('prettier', {}, project);

          const packageJson = JSON.parse(tree.readContent('package.json'));

          expect(packageJson.devDependencies).toEqual(
            expect.objectContaining({ [packageId]: expect.anything() })
          );
        }
      );

      it('should add tslint-config-prettier to tslint.json', () => {
        project.create(
          'tslint.json',
          JSON.stringify({ extends: 'some-preset' })
        );

        const tree = runner.runSchematic('prettier', {}, project);
        const tslintJson = JSON.parse(tree.readContent('tslint.json'));

        expect(tslintJson.extends).toContain('tslint-config-prettier');
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

      it('should warn if configuration is detected in package.json', () => {
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
  });

  describe('pre-commit hook', () => {
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

      it.each([['husky'], ['pretty-quick'], ['lint-staged']])(
        'should install %s',
        packageId => {
          const tree = runner.runSchematic(
            'prettier',
            defaultParameters,
            project
          );
          const packageJson = JSON.parse(tree.readContent('package.json'));

          expect(packageJson.devDependencies).toEqual(
            expect.objectContaining({ [packageId]: expect.anything() })
          );
        }
      );

      it('should configure a pre-commit hook in .huskyrc', () => {
        const tree = runner.runSchematic(
          'prettier',
          defaultParameters,
          project
        );
        const huskyRc = JSON.parse(tree.readContent('.huskyrc'));

        expect(huskyRc.hooks['pre-commit']).toEqual(
          'pretty-quick --staged && lint-staged'
        );
      });

      it('should configure lint-staged to check typescript files', () => {
        const tree = runner.runSchematic(
          'prettier',
          defaultParameters,
          project
        );
        const lintStagedRc = JSON.parse(tree.readContent('.lintstagedrc'));

        expect(lintStagedRc['*.ts']).toEqual(['tslint --fix', 'git add']);
      });
    });

    describe('When .huskyrc already exists', () => {
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
        project.create(
          '.huskyrc',
          JSON.stringify({ hooks: { 'commit-msg': 'script' } })
        );
      });

      it('should be merged', () => {
        const tree = runner.runSchematic(
          'prettier',
          defaultParameters,
          project
        );
        const huskyRc = JSON.parse(tree.readContent('.huskyrc'));

        expect(huskyRc.hooks).toEqual(
          expect.objectContaining({
            'commit-msg': expect.anything(),
            'pre-commit': expect.anything()
          })
        );
      });
    });

    describe('When a competing configuration is found', () => {
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
          husky: {}
        };
        project.create('package.json', JSON.stringify(packageBeforeInstall));
      });

      it('should warn if detected in package.json', () => {
        runner.runSchematic('prettier', {}, project);
        expect(warn).toHaveBeenCalledWith(
          'Found competing husky configuration in package.json.'
        );
      });

      it.each([['.huskyrc.json'], ['.huskyrc.js']])(
        ' should warn if detected in %s',
        (file: string) => {
          project.create(file, JSON.stringify({}));
          runner.runSchematic('prettier', {}, project);
          expect(warn).toHaveBeenCalledWith(
            `Found competing husky configuration in ${file}.`
          );
        }
      );
    });
  });
});
