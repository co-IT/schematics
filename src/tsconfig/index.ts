import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { TsConfigSchema } from './tsconfig.schema';

export default function(parameters: TsConfigSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists('tsconfig.json')) {
      throw new SchematicsException(
        'Sorry, no tsconfig.json was found in root directory.'
      );
    }

    const tsconfig = JSON.parse(tree.read('tsconfig.json')!.toString('utf-8'));

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.strict = parameters.strict;

    tree.overwrite('tsconfig.json', JSON.stringify(tsconfig));

    return tree;
  };
}
