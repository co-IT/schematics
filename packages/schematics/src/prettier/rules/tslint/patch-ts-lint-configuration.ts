import { Rule, Tree } from '@angular-devkit/schematics';

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

    const tslintJson = omitRule(originTsLintJson, 'max-line-length');

    tree.overwrite('tslint.json', JSON.stringify(tslintJson, null, 2));
  };
}

function omitRule(
  tslintConfig: { rules?: { [key: string]: any } },
  ruleKey: string
): object {
  if (!tslintConfig || !tslintConfig.rules) {
    return tslintConfig;
  }

  delete tslintConfig.rules[ruleKey];
  return tslintConfig;
}
