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

export default function(): Rule {
  return chain([registerPrettier()]);
}

function registerPrettier(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setDevDependency('prettier', 'latest');
    packageJson.setDevDependency('tslint-config-prettier', 'latest');

    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return mergeWith(apply(url('./templates'), []));
  };
}
