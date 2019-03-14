import { chain, Rule } from '@angular-devkit/schematics';
import { installDependencies } from '../lib';
import { patchTsLintConfiguration } from './rules';
import { configurePrettier, registerPrettier } from './rules/prettier';

export default function(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    configurePrettier(),
    registerPrettier(),
    patchTsLintConfiguration()
  ]);
}
