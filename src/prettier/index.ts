import {
  apply,
  chain,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { PackageJson } from '../lib';

export default function(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setDevDependency('prettier', 'latest');
    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );

    tree.overwrite('package.json', packageJson.stringify());

    _context.addTask(new NodePackageInstallTask());
    const templateSource = apply(url('./templates'), []);

    return chain([mergeWith(templateSource)])(tree, _context);
  };
}
