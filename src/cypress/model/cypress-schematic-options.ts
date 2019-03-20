export interface CypressSchematicOptions {
  /**
   * Name of the app cypress tests should be configured for.
   */
  readonly app: string;
  /**
   * Should existing e2e test folder be overwritten?
   */
  readonly overwrite: boolean;
  /**
   * Path of e2e test folder to be used as installation destination.
   * If not set, the destination folder will be derived from target app folder.
   */
  readonly folder: string;
}
