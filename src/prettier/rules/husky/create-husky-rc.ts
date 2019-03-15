import { apply, mergeWith, Rule, url } from '@angular-devkit/schematics';
export function createHuskyRc(): Rule {
  return mergeWith(apply(url('./templates/hook'), []));
}
