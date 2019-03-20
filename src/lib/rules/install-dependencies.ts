import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { PackageJson } from '../package-json';
import { InstallOptions } from './install-options';

export function installDependencies(options: InstallOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    options.devDependencies.forEach(npmPackage =>
      packageJson.setDevDependency(
        npmPackage.name,
        npmPackage.version || 'latest'
      )
    );

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
