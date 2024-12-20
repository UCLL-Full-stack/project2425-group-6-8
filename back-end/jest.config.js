/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Make sure this matches the installed package
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
};
