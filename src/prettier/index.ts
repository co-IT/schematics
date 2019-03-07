import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { PackageJson } from '../lib';

export default function(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setDevDependency('prettier', 'latest');
    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );

    tree.overwrite('package.json', packageJson.stringify());

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
