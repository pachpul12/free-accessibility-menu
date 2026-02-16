module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: ['./test/setup.js'],
};
