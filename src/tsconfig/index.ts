import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';

export default function(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists('.tsconfig')) {
      throw new SchematicsException(
        'Sorry, no tsconfig.json was found in root directory.'
      );
    }
    return tree;
  };
}
