import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const buffer = tree.read('package.json');

    if (!buffer) {
      return tree;
    }

    const nodePackageDefinitions = JSON.parse(buffer.toString('utf-8'));
    nodePackageDefinitions.devDependencies.prettier = '@latest';

    nodePackageDefinitions.scripts.format =
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}\'';

    tree.overwrite('package.json', JSON.stringify(nodePackageDefinitions));

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
