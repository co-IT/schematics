import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function commitlint(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
