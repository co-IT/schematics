import {
  apply,
  chain,
  mergeWith,
  noop,
  Rule,
  url
} from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { PrettierSchematicOptions } from './models';
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
    mergeWith(apply(url('./templates/hook'), []))
  ]);
}
