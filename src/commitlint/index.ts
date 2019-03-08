import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  mergeWith,
  apply,
  url,
  move
} from '@angular-devkit/schematics';
import { PackageJson } from '../lib';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function commitlint(_options: any): Rule {
  return chain([installCommitlintDependencies(), addCommitlintConfig()]);
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

function addCommitlintConfig(): Rule {
  return () => {
    return chain([mergeWith(apply(url('./templates'), [move('')]))]);
  };
}
