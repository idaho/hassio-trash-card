'use strict';

module.exports = {
  displayName: { name: 'source', color: 'magenta' },
  rootDir: './',
  testEnvironment: 'node',
  testPathIgnorePatterns: [ 'node_modules/', './dist' ],
  moduleFileExtensions: [ 'js', 'ts', 'tsx', 'json' ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest', {
        tsconfig: '<rootDir>/tsconfig.json',
        isolatedModules: true
      }
    ]
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: [
    `<rootDir>/src/**/*.test.ts`
  ]
};
