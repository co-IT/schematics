import {
  apply,
  chain,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import {
  installDependencies,
  PackageJson,
  warnAgainstCompetingConfiguration
} from '../lib';
import { applyHuskyConfiguration } from '../lib/rules/husky';

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
    return chain([mergeWith(apply(url('./templates/commitlint'), []))]);
  };
}

function addHuskyHook(): Rule {
  return chain([
    applyHuskyConfiguration(['commit-msg', 'commitlint -E HUSKY_GIT_PARAMS']),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'husky',
      files: ['.huskyrc.json', '.huskyrc.js']
    })
  ]);
}
