import { Rule, Tree } from '@angular-devkit/schematics';

const opinionatedTsLintRules = {
  rules: {
    quotemark: [true, 'single'],
    'arrow-parens': false,
    'max-line-length': [true, 80],
    'trailing-comma': [true, { multiline: 'never', singleline: 'never' }]
  }
};

export function patchTsLintConfiguration(): Rule {
  return (tree: Tree) => {
    const originTsLintFile = tree.read('tslint.json');
    if (!originTsLintFile) {
      return;
    }
    const originTsLintJson = JSON.parse(originTsLintFile.toString('utf-8'));
    if (Array.isArray(originTsLintJson.extends)) {
      originTsLintJson.extends.push('tslint-config-prettier');
    } else if (originTsLintJson.extends) {
      originTsLintJson.extends = [
        originTsLintJson.extends,
        'tslint-config-prettier'
      ];
    } else {
      originTsLintJson.extends = ['tslint-config-prettier'];
    }

    const tslintJson = { ...originTsLintJson, ...opinionatedTsLintRules };

    tree.overwrite('tslint.json', JSON.stringify(tslintJson, null, 2));
  };
}
