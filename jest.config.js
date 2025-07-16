/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/config/jest.setup.ts'],
  globalSetup: '<rootDir>/src/__tests__/config/globalSetup.ts',
  globalTeardown: '<rootDir>/src/__tests__/config/globalTeardown.ts',
};