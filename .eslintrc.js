module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
  ],
  rules: {
    "import/prefer-default-export": 0,
  },

  // https://github.com/import-js/eslint-plugin-import/issues/1289
  settings: {
    "import/core-modules": [
      "@expo/vector-icons"
    ]
  },
};
