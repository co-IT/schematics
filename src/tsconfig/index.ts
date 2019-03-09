import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { CompilerOptions } from './compiler-options.schema';

export default function(parameters: CompilerOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists('tsconfig.json')) {
      throw new SchematicsException(
        'Sorry, no tsconfig.json was found in root directory.'
      );
    }

    const tsconfig = JSON.parse(tree.read('tsconfig.json')!.toString('utf-8'));

    tsconfig.compilerOptions = {
      ...(tsconfig.compilerOptions || {}),
      ...parameters
    };

    tree.overwrite('tsconfig.json', JSON.stringify(tsconfig, null, 2));

    return tree;
  };
}
