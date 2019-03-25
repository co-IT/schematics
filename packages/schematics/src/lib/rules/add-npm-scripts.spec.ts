import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { addNpmScripts } from './add-npm-scripts';

describe('addNpmScripts', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());

    const packageBefore = { scripts: {}, devDependencies: {} };
    tree.create('package.json', JSON.stringify(packageBefore));
  });

  it('should add a single npm script to package.json', () => {
    const rule = addNpmScripts({ name: 'name1', command: 'command1' });
    rule(tree, null!);

    const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
    expect(packageAfterInstall.scripts).toEqual(
      expect.objectContaining({ name1: 'command1' })
    );
  });

  it('should add multiple npm scripts to package.json', () => {
    const rule = addNpmScripts(
      { name: 'name1', command: 'command1' },
      { name: 'name2', command: 'command2' }
    );
    rule(tree, null!);

    const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
    expect(packageAfterInstall.scripts).toEqual(
      expect.objectContaining({ name1: 'command1', name2: 'command2' })
    );
  });

  it('should add no npm script(s) to package.json', () => {
    const rule = addNpmScripts();
    rule(tree, null!);

    const packageAfterInstall = JSON.parse(tree.readContent('package.json'));
    expect(packageAfterInstall.scripts).toEqual({});
  });
});
