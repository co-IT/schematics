import { SchematicsException } from '@angular-devkit/schematics';
import { PackageJsonSchema } from './package-json-schema';

export class PackageJson {
  private _config: PackageJsonSchema = {
    devDependencies: {},
    scripts: {}
  };

  constructor(buffer: Buffer | undefined | null) {
    if (this._hasNoContent(buffer)) {
      throw new SchematicsException(
        'Sorry, package.json file could not be found.'
      );
    }

    this._config = {
      ...this._config,
      ...JSON.parse(buffer.toString('utf-8'))
    };
  }

  setDevDependency(name: string, version: string): void {
    this._config.devDependencies[name] = version;
  }
  setScript(name: string, command: string): void {
    this._config.scripts[name] = command;
  }
  setHuskyHook(name: string, command: string): void {
    if (!this._config.husky) {
      this._config.husky = { hooks: {} };
    }
    if (!this._config.husky.hooks) {
      this._config.husky.hooks = {};
    }
    this._config.husky.hooks[name] = command;
  }
  stringify(): string {
    return JSON.stringify(this._config, null, 2);
  }

  private _hasNoContent(
    buffer: Buffer | undefined | null
  ): buffer is undefined | null {
    if (!buffer) {
      return true;
    }
    return false;
  }
}
