module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: ['eslint:recommended'],
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    'eol-last': ['warn', 'always'],
    'no-debugger': 'warn',
    'jsx-quotes': ['warn','prefer-double'],
    'key-spacing': 'warn',
    'keyword-spacing': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-trailing-spaces': 'warn',
    'space-infix-ops': ['warn', {'int32Hint': false}]
  }
};
