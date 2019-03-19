import { Rule, chain } from '@angular-devkit/schematics';
import { configureJest } from './rules/jest/configure-jest';

export default function(): Rule {
  return chain([configureJest()]);
}
