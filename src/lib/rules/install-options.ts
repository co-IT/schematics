import { NpmPackage } from './npm-package';

export interface InstallOptions {
  /**
   * Array containing package names to be installed as devDependencies
   */
  readonly devDependencies: NpmPackage[];
}
