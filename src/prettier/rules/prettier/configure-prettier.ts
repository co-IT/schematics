import {
  apply,
  MergeStrategy,
  mergeWith,
  Rule,
  url
} from '@angular-devkit/schematics';

export function configurePrettier(): Rule {
  return mergeWith(apply(url('./templates'), []), MergeStrategy.Overwrite);
}
