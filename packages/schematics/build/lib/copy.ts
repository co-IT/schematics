import { copy as cp } from 'fs-extra';
import globby from 'globby';
import { resolve } from 'path';

export function copy(tasks: [string, string][]) {
  return Promise.all(tasks.map(task => copySingle(task[0], task[1])));
}

export function copySingle(from: string, dest: string) {
  return globby(from, { dot: true }).then((sources: string[]) =>
    Promise.all(sources.map(source => cp(source, resolve(dest, source))))
  );
}
