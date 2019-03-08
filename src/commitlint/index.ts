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
import { PackageJson, installDependencies } from '../lib';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function commitlint(_options: any): Rule {
  return chain([
    installDependencies({
      devDependencies: [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'husky'
      ]
    }),
    addCommitlintConfig(),
    addHuskyHook()
  ]);
}

function addCommitlintConfig(): Rule {
  return () => {
    return chain([mergeWith(apply(url('./templates'), [move('')]))]);
  };
}

function addHuskyHook(): Rule {
  return (tree: Tree) => {
    const packageJson = new PackageJson(tree.read('package.json'));

    packageJson.setHuskyHook('commit-msg', 'commitlint -E HUSKY_GIT_PARAMS');

    tree.overwrite('package.json', packageJson.stringify());

    return tree;
  };
}
