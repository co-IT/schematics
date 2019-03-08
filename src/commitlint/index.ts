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
    addCommitlintConfig()
  ]);
}

function addCommitlintConfig(): Rule {
  return () => {
    return chain([mergeWith(apply(url('./templates'), [move('')]))]);
  };
}
