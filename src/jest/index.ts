import { Rule, chain } from '@angular-devkit/schematics';
import { configureJest, registerJest } from './rules/jest';
import { patchTsConfig } from './rules/tsconfig/patch-tsconfig';

export default function(): Rule {
  return chain([configureJest(), registerJest(), patchTsConfig()]);
}
