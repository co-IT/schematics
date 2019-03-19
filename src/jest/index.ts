import { Rule, chain } from '@angular-devkit/schematics';
import { configureJest, registerJest } from './rules/jest';

export default function(): Rule {
  return chain([configureJest(), registerJest()]);
}
