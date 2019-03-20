import { NpmPackage } from './package';

export interface InstallOptions {
  /**
   * Array containing package names to be installed as devDependencies
   */
  readonly devDependencies: NpmPackage[];
}
