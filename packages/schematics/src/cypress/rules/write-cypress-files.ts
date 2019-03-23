import {
  Rule,
  Tree,
  mergeWith,
  apply,
  url,
  template
} from '@angular-devkit/schematics';
import { AngularJson } from 'src/lib';
import { CypressSchematicOptions } from '../model';
import { getE2eProjectNameForApp } from './utils';
import { strings } from '@angular-devkit/core';

export function writeCypressFiles(
  options: CypressSchematicOptions,
  angularJson: AngularJson
): Rule {
  return (_tree: Tree) => {
    const e2eProjectName = getE2eProjectNameForApp(options.app);

    const root = angularJson.getRootPathFor(e2eProjectName);

    _tree.getDir(root).visit(oldFile => {
      _tree.delete(oldFile);
    });

    const dotsUp = root.replace(/[^/]+/g, '..');
    const tsOutDir = `${dotsUp}dist/out-tsc/apps/${e2eProjectName}`;
    const tsExtends = `${dotsUp}tsconfig.json`;

    return mergeWith(
      apply(url('./templates/cypress-initial'), [
        template({
          ...strings,
          root,
          tsOutDir,
          tsExtends
        })
      ])
    );
  };
}
