const esModules = ['jest-test'].join('|');

module.exports = {
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@env': '<rootDir>/src/environments/environment',
    '@src/(.*)': '<rootDir>/src/src/$1',
    '@state/(.*)': '<rootDir>/src/app/state/$1',
    // This is part of the default config of @angular-builders/jest
    '\\.(jpg|jpeg|png)$': `${__dirname}/mock-module.js`
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`]
};
