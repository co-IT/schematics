export class PackageJson {
  private _config: {
    devDependencies: {
      [key: string]: string;
    };
    scripts: {
      [key: string]: string;
    };
  };
  constructor(buffer: Buffer) {
    this._config = JSON.parse(buffer.toString('utf-8'));
  }
  setDevDependency(name: string, version: string): void {
    this._config.devDependencies[name] = version;
  }
  setScript(name: string, command: string): void {
    this._config.scripts[name] = command;
  }
  stringify(): string {
    return JSON.stringify(this._config);
  }
}
