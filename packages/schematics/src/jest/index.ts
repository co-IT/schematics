import { Rule, chain } from '@angular-devkit/schematics';
import { configureJest, registerJest, registerBuilder } from './rules/jest';
import { patchTsConfig } from './rules/tsconfig/patch-tsconfig';
import { JestConfigOptions } from './models/jest-config-options';
import { configureHusky } from './rules/husky';

export default function(config: JestConfigOptions): Rule {
  return chain([
    configureJest(config),
    registerJest(),
    registerBuilder(config),
    patchTsConfig(config),
    config.hook && !config.app ? configureHusky() : chain([])
  ]);
}
