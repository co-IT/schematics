import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { patchTsLintConfiguration } from './patch-ts-lint-configuration';

describe('When "extends" does not exist', () => {
  it('should add the property and add prettier tslint configuration', () => {
    const rule = patchTsLintConfiguration();
    const emptyContext: SchematicContext = {} as SchematicContext;
    const tree = new UnitTestTree(Tree.empty());
    tree.create('tslint.json', JSON.stringify({}));

    rule(tree, emptyContext);

    const tslintJson = JSON.parse(tree.readContent('tslint.json'));
    expect(tslintJson.extends).toContain('tslint-config-prettier');
  });
});
