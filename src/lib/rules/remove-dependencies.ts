import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { PackageJson } from '..';
import { InstallOptions } from './install-options';

export function removeDependencies(options: InstallOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    options.devDependencies.forEach(packageName =>
      packageJson.removeDevDependency(packageName.name)
    );

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
