/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  globalSetup: '<rootDir>/src/__tests__/config/globalSetup.ts',
  globalTeardown: '<rootDir>/src/__tests__/config/globalTeardown.ts',
   collectCoverage: true,
   collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/config/**",
  ],
  coverageReporters: ['text', 'lcov'],
};