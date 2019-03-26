import { strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  Rule,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { CypressSchematicOptions } from '../model';
import { getE2eProjectNameForApp, readAngularJson } from './utils';

export function writeCypressFiles(options: CypressSchematicOptions): Rule {
  return (tree: Tree) => {
    const ngConfig = readAngularJson(tree);
    const e2eProjectName = getE2eProjectNameForApp(options.app);

    const root = ngConfig.getRootPathFor(e2eProjectName);

    tree.getDir(root).visit(oldFile => {
      tree.delete(oldFile);
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
