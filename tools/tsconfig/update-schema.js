const write = require('fs-extra').writeFile;
const fetch = require('node-fetch');

/**
 * Downloads the schema for tsconfig.json
 * @param url download source for schema file
 */
function downloadSchema(url) {
  return fetch(url)
    .then(response => response.json())
    .then(schema => {
      delete schema.$schema;
      return schema;
    })
    .then(schema => JSON.stringify(schema, null, 2));
}

downloadSchema('http://json.schemastore.org/tsconfig')
  .then(schema => write('./src/tsconfig/test/schema.json', schema))
  .catch(err => console.log(err));
