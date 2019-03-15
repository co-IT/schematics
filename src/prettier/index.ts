import { chain, noop, Rule } from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { PrettierSchematicOptions } from './models';
import { applyHuskyConfiguration } from './rules/husky';
import {
  configurePrettier,
  registerPrettier,
  warnAgainstCompetingPrettierConfiguration
} from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

export default function(parameters: PrettierSchematicOptions): Rule {
  return chain([
    configurePrettier(),
    warnAgainstCompetingPrettierConfiguration(),
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
    applyHuskyConfiguration()
  ]);
}
