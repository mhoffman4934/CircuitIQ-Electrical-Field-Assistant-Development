import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['src/generated/**', 'dist/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['test/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { process: 'readonly', URL: 'readonly' } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
