
module.exports = {
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
    'plugin:import/warnings'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'typescript-sort-keys',
    'sort-destructure-keys',
    'import'
  ],
  rules: {
    'prettier/prettier': ['warn'],
    'no-debugger': ['warn'],
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-empty-pattern': 'off',
    'sort-destructure-keys/sort-destructure-keys': 'warn',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', propElementValues: 'always' }],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: false,
        shorthandLast: true,
        ignoreCase: true,
        noSortAlphabetically: false
      }
    ],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'import/order': [
      'warn',
      {
        'newlines-between': 'always-and-inside-groups',
        groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent', 'object', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
