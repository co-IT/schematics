import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  url
} from '@angular-devkit/schematics';
import { installDependencies } from '../../../lib';

export function configurePrettier(): Rule {
  return chain([
    installDependencies({
      devDependencies: ['prettier', 'tslint-config-prettier']
    }),
    mergeWith(apply(url('./templates'), []), MergeStrategy.Overwrite)
  ]);
}
