import { Rule, Tree } from '@angular-devkit/schematics';
import { readAngularJson } from '../../../cypress/rules/utils';
import { JestConfigOptions } from '../../models/jest-config-options';
import { TsconfigPatchOptions } from '../../models/tsconfig-patch-options';

export function patchTsConfig(config: JestConfigOptions): Rule {
  return (tree: Tree) => {
    const ngConfig = readAngularJson(tree);
    const root =
      config && config.app ? `${ngConfig.getRootPathFor(config.app)}/` : '';

    // TODO: Read path to project tsconfig.sepc from angular.json
    const file = 'tsconfig.spec.json';

    const buffer = tree.read(file);
    if (!buffer) {
      throw new Error(`No ${file} found`);
    }
    const tsconfig: TsconfigPatchOptions = JSON.parse(buffer.toString('utf-8'));
    tsconfig.compilerOptions = tsconfig.compilerOptions || {
      types: [],
      module: ''
    };
    tsconfig.files = tsconfig.files || [];

    tsconfig.compilerOptions.types.splice(
      tsconfig.compilerOptions.types.indexOf('jasmine'),
      1,
      'jest'
    );
    tsconfig.compilerOptions.module = 'commonjs';
    tsconfig.files.splice(tsconfig.files.indexOf('test.ts'), 1);
    tsconfig.files.splice(tsconfig.files.indexOf('src/test.ts'), 1);

    tree.overwrite(file, JSON.stringify(tsconfig, null, 2));
  };
}
