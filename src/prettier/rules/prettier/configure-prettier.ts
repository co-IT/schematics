import {
  apply,
  chain,
  forEach,
  MergeStrategy,
  mergeWith,
  Rule,
  Tree,
  url
} from '@angular-devkit/schematics';
import { installDependencies } from '../../../lib';

export function configurePrettier(): Rule {
  return (tree: Tree) =>
    chain([
      installDependencies({
        devDependencies: ['prettier', 'tslint-config-prettier']
      }),
      mergeWith(
        apply(url('./templates/prettier'), [
          forEach(template => {
            tree.exists(template.path)
              ? tree.overwrite(template.path, template.content)
              : tree.create(template.path, template.content);
            return null;
          })
        ]),
        MergeStrategy.Overwrite
      )
    ]);
}
