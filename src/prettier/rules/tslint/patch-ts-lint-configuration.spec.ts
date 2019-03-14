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

  it('should enforce max line length 80', () => {
    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.rules['max-line-length']).toEqual([true, 80]);
  });

  it('should avoid arrow parens', () => {
    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.rules['arrow-parens']).toBe(false);
  });

  it('should avoid trailing-comma', () => {
    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.rules['trailing-comma']).toEqual([
      true,
      { multiline: 'never', singleline: 'never' }
    ]);
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
