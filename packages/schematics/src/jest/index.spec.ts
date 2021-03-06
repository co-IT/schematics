import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as path from 'path';
import { JestConfigOptions } from './models/jest-config-options';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@co-it/schematics:jest', () => {
  let runner: SchematicTestRunner;
  let actualTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('jest', collectionPath);
    actualTree = new UnitTestTree(Tree.empty());

    const packageBeforeInstall = {
      scripts: {},
      devDependencies: {
        karma: 'latest',
        'karma-chrome-launcher': 'latest',
        'karma-coverage-istanbul-reporter': 'latest',
        'karma-jasmine': 'latest',
        'karma-jasmine-html-reporter': 'latest'
      }
    };
    const specsTsConfigBeforeInstall = {
      compilerOptions: {
        types: ['jasmine', 'node']
      },
      files: ['test.ts']
    };
    actualTree.create('package.json', JSON.stringify(packageBeforeInstall));
    actualTree.create(
      'angular.json',
      JSON.stringify({
        defaultProject: 'my-app',
        projects: {
          'my-app': {
            projectType: 'application',
            architect: {
              test: {
                builder: '@angular-devkit/build-angular:karma',
                options: {
                  main: 'src/test.ts',
                  polyfills: 'src/polyfills.ts',
                  tsConfig: 'src/tsconfig.spec.json',
                  karmaConfig: 'src/karma.conf.js'
                }
              }
            }
          },
          'my-second-app': {
            root: 'projects/my-second-app',
            projectType: 'application',
            architect: {
              test: {
                builder: '@angular-devkit/build-angular:karma',
                options: {
                  main: 'projects/my-second-app/src/test.ts',
                  tsConfig: 'projects/my-second-app/tsconfig.spec.json',
                  karmaConfig: 'projects/my-second-app/karma.conf.js'
                }
              }
            }
          }
        }
      })
    );
    actualTree.create(
      'src/tsconfig.spec.json',
      JSON.stringify(specsTsConfigBeforeInstall)
    );
    actualTree.create(
      'projects/my-second-app/tsconfig.spec.json',
      JSON.stringify(specsTsConfigBeforeInstall)
    );
  });

  describe('when jest is not installed', () => {
    it.each([['jest'], ['@angular-builders/jest']])(
      'should add %p to devDependencies',
      (packageId: string) => {
        const tree = runner.runSchematic('jest', {}, actualTree);

        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies).toEqual(
          expect.objectContaining({ [packageId]: expect.anything() })
        );
      }
    );

    it('should add a jest configuration file', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      expect(tree.exists('src/jest.config.js'));
    });

    it('should add a jest setup file', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);

      expect(tree.exists('src/setup-jest.ts'));
    });
    it.each([
      ['karma'],
      ['karma-chrome-launcher'],
      ['karma-coverage-istanbul-reporter'],
      ['karma-jasmine'],
      ['karma-jasmine-html-reporter']
    ])(
      'should remove all karma related Packages from dev-dependencies',
      (packageId: string) => {
        const tree = runner.runSchematic('jest', {}, actualTree);
        const packageJson = JSON.parse(tree.readContent('package.json'));

        expect(packageJson.devDependencies[packageId]).toBeUndefined();
      }
    );

    it('should remove the karma configuration', () => {
      actualTree.create('src/karma.conf.js', '');

      const tree = runner.runSchematic('jest', {}, actualTree);
      expect(tree.exists('src/karma.conf.js')).toBe(false);
    });

    it('should remove the karma setup file', () => {
      actualTree.create('src/test.ts', '');

      const tree = runner.runSchematic('jest', {}, actualTree);
      expect(tree.exists('src/test.ts')).toBe(false);
    });

    it('should remove the karma setup file from the test-tsConfig', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const tsConfig = JSON.parse(tree.readContent('src/tsconfig.spec.json'));

      expect(tsConfig.files.includes('test.ts')).toBe(false);
    });

    it('should remove jasmine types from test-compiler options', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const tsConfig = JSON.parse(tree.readContent('src/tsconfig.spec.json'));

      expect(tsConfig.compilerOptions.types.includes('jasmine')).toBe(false);
    });

    it('should add jest types to test-compiler options', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const tsConfig = JSON.parse(tree.readContent('src/tsconfig.spec.json'));

      expect(tsConfig.compilerOptions.types.includes('jest')).toBe(true);
    });

    it('should set module to commonjs in test-compiler options', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const tsConfig = JSON.parse(tree.readContent('src/tsconfig.spec.json'));

      expect(tsConfig.compilerOptions.module).toBe('commonjs');
    });

    it('should override the builder for the test-architect in angular.json for the default project', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const angularJson = JSON.parse(tree.readContent('angular.json'));

      expect(angularJson.projects['my-app'].architect.test.builder).toBe(
        '@angular-builders/jest:run'
      );
    });
    it('should remove the karma related configs from test-architect in angular.json for the default project', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const angularJson = JSON.parse(tree.readContent('angular.json'));

      expect(
        angularJson.projects['my-app'].architect.test.options.karmaConfig
      ).toBeUndefined();
    });
  });

  describe('when package.json does not contain jest scripts', () => {
    it('should add a jest watch script', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
      expect(packageAfterInstall.scripts['test:watch']).toBe('ng test --watch');
    });

    it('should set the test script to jest', () => {
      const tree = runner.runSchematic('jest', {}, actualTree);
      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
      expect(packageAfterInstall.scripts['test']).toBe('ng test');
    });
  });

  describe('husky configuration', () => {
    describe('if the user don´t want to add a husky hook for jest', () => {
      it('husky should not be configured', () => {
        const tree = runner.runSchematic('jest', { hook: false }, actualTree);

        expect(tree.exists('.huskyrc')).toBe(false);
      });
    });

    describe('if husky isn´t configured in the project', () => {
      it('should add a .huskyrc file', () => {
        const tree = runner.runSchematic('jest', {}, actualTree);
        expect(tree.exists('.huskyrc')).toBe(true);
      });

      it('huskyrc should contain a jest pre-push hook', () => {
        const tree = runner.runSchematic('jest', {}, actualTree);

        expect(JSON.parse(tree.readContent('.huskyrc'))).toHaveProperty(
          'hooks.pre-push',
          'ng test'
        );
      });
    });

    describe('if husky is already configured for the projet in .huskyrc', () => {
      it('should add the jest hook to .huskyrc', () => {
        actualTree.create(
          '.huskyrc',
          JSON.stringify({ hooks: { 'some-hook': 'script' } })
        );
        const tree = runner.runSchematic('jest', {}, actualTree);
        const mergedHooks = {
          hooks: { 'pre-push': 'ng test', 'some-hook': 'script' }
        };
        expect(JSON.parse(tree.readContent('.huskyrc'))).toEqual(mergedHooks);
      });
    });

    describe('When a competing configuration is found', () => {
      let mockLogger: { warn: () => void };
      let warn: jest.SpyInstance;

      beforeEach(() => {
        mockLogger = { warn: () => {} };
        runner['_logger'] = { createChild: () => mockLogger as any } as any;
        warn = jest.spyOn(mockLogger, 'warn');
      });
      it('should warn if detected in package.json', () => {
        const packageBeforeInstall = {
          scripts: {},
          devDependencies: {},
          husky: {}
        };
        actualTree.overwrite(
          'package.json',
          JSON.stringify(packageBeforeInstall)
        );
        runner.runSchematic('jest', {}, actualTree);

        expect(warn).toHaveBeenCalledWith(
          'Found competing husky configuration in package.json.'
        );
      });

      it.each([['.huskyrc.json'], ['.huskyrc.js']])(
        ' should warn if detected in %s',
        (file: string) => {
          actualTree.create(file, JSON.stringify({}));
          runner.runSchematic('jest', {}, actualTree);
          expect(warn).toHaveBeenCalledWith(
            `Found competing husky configuration in ${file}.`
          );
        }
      );
    });
  });
  describe('When an app name is specified', () => {
    const config: JestConfigOptions = { app: 'my-second-app', hook: false };
    beforeEach(() => {});
    it('should set the jest builder for the app in angular.json', () => {
      const tree = runner.runSchematic('jest', config, actualTree);
      const angularJson = JSON.parse(tree.readContent('angular.json'));
      expect(angularJson.projects['my-second-app'].architect.test.builder).toBe(
        '@angular-builders/jest:run'
      );
    });

    it('should remove the karma configuration', () => {
      actualTree.create('projects/my-second-app/karma.conf.js', '');

      const tree = runner.runSchematic('jest', config, actualTree);
      expect(tree.exists('projects/my-second-app/karma.conf.js')).toBe(false);
    });

    it('should remove the karma setup file for the specified app', () => {
      actualTree.create('projects/my-second-app/src/test.ts', '');

      const tree = runner.runSchematic('jest', config, actualTree);
      expect(tree.exists('projects/my-second-app/src/test.ts')).toBe(false);
    });

    it('should remove the karma setup file from the test-tsConfig for the specified app', () => {
      const tree = runner.runSchematic('jest', config, actualTree);
      const tsConfig = JSON.parse(
        tree.readContent('projects/my-second-app/tsconfig.spec.json')
      );

      expect(tsConfig.files.includes('test.ts')).toBe(false);
    });

    it('should remove jasmine types from test-compiler options for the specified app', () => {
      const tree = runner.runSchematic('jest', config, actualTree);
      const tsConfig = JSON.parse(
        tree.readContent('projects/my-second-app/tsconfig.spec.json')
      );

      expect(tsConfig.compilerOptions.types.includes('jasmine')).toBe(false);
    });

    it('should add jest types to test-compiler options for the specified app', () => {
      const tree = runner.runSchematic('jest', config, actualTree);
      const tsConfig = JSON.parse(
        tree.readContent('projects/my-second-app/tsconfig.spec.json')
      );

      expect(tsConfig.compilerOptions.types.includes('jest')).toBe(true);
    });

    it('should set module to commonjs in test-compiler options for the specified app', () => {
      const tree = runner.runSchematic('jest', config, actualTree);
      const tsConfig = JSON.parse(
        tree.readContent('projects/my-second-app/tsconfig.spec.json')
      );

      expect(tsConfig.compilerOptions.module).toBe('commonjs');
    });
    it('should add a jest configuration for the additional app in the root', () => {
      const tree = runner.runSchematic('jest', config, actualTree);

      expect(tree.exists('projects/my-second-app/jest.config.js')).toBe(true);
    });
  });
});
