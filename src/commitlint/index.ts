import {
  apply,
  chain,
  forEach,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies, warnAgainstCompetingConfiguration } from '../lib';
import { applyHuskyConfiguration } from '../lib/rules/husky';

export default function commitlint(): Rule {
  return chain([
    installDependencies({
      devDependencies: [
        { name: '@commitlint/cli' },
        { name: '@commitlint/config-conventional' },
        { name: 'husky' }
      ]
    }),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'commitlint',
      files: ['commitlint.config.js']
    }),
    addCommitlintConfig(),
    addHuskyHook()
  ]);
}

function addCommitlintConfig(): Rule {
  return (tree: Tree) => {
    return chain([
      mergeWith(
        apply(url('./templates/commitlint'), [
          forEach(template => {
            tree.exists(template.path)
              ? tree.overwrite(template.path, template.content)
              : tree.create(template.path, template.content);
            return null;
          })
        ])
      )
    ]);
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
