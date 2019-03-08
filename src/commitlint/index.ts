import {
  Rule,
  SchematicContext,
  Tree,
  chain
} from '@angular-devkit/schematics';
import { PackageJson } from '../lib';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function commitlint(_options: any): Rule {
  return chain([installCommitlintDependencies()]);
}

function installCommitlintDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setDevDependency('@commitlint/cli', 'latest');
    packageJson.setDevDependency('@commitlint/config-conventional', 'latest');

    tree.overwrite('package.json', packageJson.stringify());

    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
