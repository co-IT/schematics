import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { InstallOptions } from './install-options';
import { PackageJson } from '..';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function removeDependencies(options: InstallOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    options.devDependencies.forEach(packageName =>
      packageJson.removeDevDependency(packageName)
    );

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
