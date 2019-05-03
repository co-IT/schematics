import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Creates a folder in temp directory with a unique folder name.
 * @param namePrefix prefix of the folder name,
 *                   will be appended with a random string.
 * @returns the full folder path
 */
export function createTempFolder(namePrefix: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(path.join(os.tmpdir(), namePrefix), (error, folder) => {
      if (error) {
        reject(error);
      } else {
        resolve(folder);
      }
    });
  });
}
