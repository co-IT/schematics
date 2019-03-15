import { chain, Rule } from '@angular-devkit/schematics';
import {
  configurePrettier,
  registerPrettier,
  warnAgainstCompetingPrettierConfiguration
} from './rules/prettier';
import { patchTsLintConfiguration } from './rules/tslint';

export default function(): Rule {
  return chain([
    configurePrettier(),
    warnAgainstCompetingPrettierConfiguration(),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}
