import { clean, copy, npmRun } from './lib';

clean('./dist')
  .then(() => npmRun('tsc:prod'))
  .then(() =>
    copy([
      ['./README.md', './dist'],
      ['./package.json', './dist'],
      ['./src/collection.json', './dist'],
      ['./src/**/schema.json', './dist'],
      ['./src/prettier/templates/.prettierrc', './dist'],
      ['./src/**/templates/**/*', './dist']
    ])
  )
  .catch(err => {
    console.log(err);
    return process.exit(1);
  });
