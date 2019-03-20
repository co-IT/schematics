import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { installDependencies } from './install-dependencies';
import { removeDependencies } from '..';

describe('removeDependencies', () => {
  describe('When a dependency is installed', () => {
    let tree: UnitTestTree;
    let mockContext: Partial<SchematicContext>;

    beforeEach(() => {
      tree = new UnitTestTree(Tree.empty());

      const packageBeforeInstall = {
        scripts: {},
        devDependencies: {
          'test-dependency1': 'latest',
          'test-dependency2': 'latest'
        }
      };
      tree.create('package.json', JSON.stringify(packageBeforeInstall));
      mockContext = { addTask: jest.fn() };
    });

    it('should remove devDependencies from package.json', () => {
      const rule = removeDependencies({
        devDependencies: ['test-dependency2']
      });
      rule(tree, mockContext as SchematicContext);

      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
      expect(packageAfterInstall.devDependencies).toEqual(
        expect.not.objectContaining({
          'test-dependency2': 'latest'
        })
      );
    });
  });
});
