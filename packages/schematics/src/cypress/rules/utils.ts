import { Tree } from '@angular-devkit/schematics';
import { AngularJson } from '../../lib';

export function getE2eProjectNameForApp(appName: string) {
  return `${appName}-e2e`;
}

export function readAngularJson(tree: Tree): AngularJson {
  const angularJsonBuffer = tree.read('angular.json')!;
  const angularJson = new AngularJson(angularJsonBuffer);
  return angularJson;
}
