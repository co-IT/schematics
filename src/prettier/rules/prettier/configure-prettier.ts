import { apply, mergeWith, Rule, url } from '@angular-devkit/schematics';
export function configurePrettier(): Rule {
  return mergeWith(apply(url('./templates'), []));
}
