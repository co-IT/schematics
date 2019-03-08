import {
  apply,
  chain,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies, PackageJson } from '../lib';

export default function commitlint(): Rule {
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
    return chain([mergeWith(apply(url('./templates'), []))]);
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
