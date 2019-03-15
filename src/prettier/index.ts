import { chain, Rule } from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import {
  configurePrettier,
  registerPrettier,
  warnAgainstCompetingPrettierConfiguration
} from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

export default function(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    configurePrettier(),
    warnAgainstCompetingPrettierConfiguration(),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}
