import { chain, noop, Rule } from '@angular-devkit/schematics';
import { installDependencies, warnAgainstCompetingConfiguration } from '../lib';
import { PrettierSchematicOptions } from './models';
import { configurePrettier, registerPrettier } from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';
import { applyHuskyConfiguration } from '../lib/rules/husky';

export default function(parameters: PrettierSchematicOptions): Rule {
  return chain([
    configurePrettier(),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'prettier',
      files: [
        '.prettierrc.yaml',
        '.prettierrc.yml',
        '.prettierrc.toml',
        '.prettierrc.json',
        '.prettierrc.js',
        '.prettier.config.js'
      ]
    }),
    registerPrettier(),
    patchTsLintConfiguration(),
    parameters.hook ? configureHusky() : noop()
  ]);
}

export function configureHusky(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['husky', 'pretty-quick', 'lint-staged']
    }),
    applyHuskyConfiguration([
      'pre-commit',
      'pretty-quick --staged && lint-staged'
    ]),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'husky',
      files: ['.huskyrc.json', '.huskyrc.js']
    })
  ]);
}
