import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { installDependencies } from './install-dependencies';

describe('installDependencies', () => {
  describe('When dependency is not installed', () => {
    let tree: UnitTestTree;
    let mockContext: Partial<SchematicContext>;

    beforeEach(() => {
      tree = new UnitTestTree(Tree.empty());

      const packageBeforeInstall = { scripts: {}, devDependencies: {} };
      tree.create('package.json', JSON.stringify(packageBeforeInstall));

      mockContext = {
        addTask: jest.fn()
      };
    });

    it('should add devDependencies to package.json', () => {
      const rule = installDependencies({
        devDependencies: ['test-dependency1', 'test-dependency2']
      });
      rule(tree, mockContext as SchematicContext);

      const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
      expect(packageAfterInstall.devDependencies).toEqual(
        expect.objectContaining({
          'test-dependency1': 'latest',
          'test-dependency2': 'latest'
        })
      );
    });

    it('should add a NodePackageInstallTask to context', () => {
      const rule = installDependencies({
        devDependencies: ['test-dependency']
      });
      rule(tree, mockContext as SchematicContext);

      expect(mockContext.addTask).toHaveBeenCalledWith(
        expect.any(NodePackageInstallTask)
      );
    });
  });
});
