import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { patchTsLintConfiguration } from './patch-ts-lint-configuration';

describe('When "extends" does not exist', () => {
  let rule: Rule;
  let emptyContext: SchematicContext;
  let tree: UnitTestTree;

  beforeEach(() => {
    rule = patchTsLintConfiguration();
    emptyContext = {} as SchematicContext;
    tree = new UnitTestTree(Tree.empty());
    tree.create('tslint.json', JSON.stringify({}));
  });

  it('should add the property and add prettier tslint configuration', () => {
    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.extends).toContain('tslint-config-prettier');
  });

  it('should enforce single quotes', () => {
    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.rules.quotemark).toEqual([true, 'single']);
  });
});

describe('When no tslint.json is present', () => {
  it('should skip patching tslint configuration', () => {
    const rule = patchTsLintConfiguration();
    const tree = new UnitTestTree(Tree.empty());
    const emptyContext: SchematicContext = {} as SchematicContext;

    expect(() => rule(tree, emptyContext)).not.toThrow();
  });
});
