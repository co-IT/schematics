import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { PackageJson } from '../package-json';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export interface InstallOptions {
  /**
   * Array containing package names to be installed as devDependencies
   */
  readonly devDependencies: string[];
}

export function installDependencies(options: InstallOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    options.devDependencies.forEach(packageName =>
      packageJson.setDevDependency(packageName, 'latest')
    );

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
