module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'always'],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    'lib/',
    'dist/',
    '*.d.ts',
  ],
};