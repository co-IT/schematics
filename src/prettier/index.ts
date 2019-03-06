import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const buffer = tree.read('package.json');

    if (!buffer) {
      return tree;
    }

    const packageJson = new PackageJson(buffer);
    packageJson.setDevDependency('prettier', 'latest');
    packageJson.setScript(
      'format',
      'prettier --write "**/*.{js,json,css,scss,md,ts,html}"'
    );

    tree.overwrite('package.json', packageJson.stringify());

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}

class PackageJson {
  private _config: {
    devDependencies: { [key: string]: string };
    scripts: { [key: string]: string };
  };

  constructor(buffer: Buffer) {
    this._config = JSON.parse(buffer.toString('utf-8'));
  }

  setDevDependency(name: string, version: string): void {
    this._config.devDependencies[name] = version;
  }

  setScript(name: string, command: string): void {
    this._config.scripts[name] = command;
  }

  stringify(): string {
    return JSON.stringify(this._config);
  }
}
