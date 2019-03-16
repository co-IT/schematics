import { chain, noop, Rule } from '@angular-devkit/schematics';
import { installDependencies, warnAgainstCompetingConfiguration } from '../lib';
import { PrettierSchematicOptions } from './models';
import { applyHuskyConfiguration } from './rules/husky';
import { configurePrettier, registerPrettier } from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

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
    applyHuskyConfiguration(),
    warnAgainstCompetingConfiguration({
      packageJsonKey: 'husky',
      files: ['.huskyrc.json', '.huskyrc.js']
    })
  ]);
}
