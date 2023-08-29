module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'never'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'dot-notation': 'off',
    quotes: 'off',
    'prettier/prettier': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-dupe-class-members': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
}
