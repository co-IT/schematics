import { Tree, Rule } from '@angular-devkit/schematics';
import { TsconfigPatchOptions } from '../../models/tsconfig-patch-options';

export function patchTsConfig(): Rule {
  return (tree: Tree) => {
    const file = 'src/tsconfig.spec.json';
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

    tree.overwrite(file, JSON.stringify(tsconfig, null, 2));
  };
}
