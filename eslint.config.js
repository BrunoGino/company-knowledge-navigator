import prettierplugin from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig([
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  includeIgnoreFile(
    fileURLToPath(new URL('.gitignore', import.meta.url)),
    'Imported .gitignore patterns'
  ),
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ['.prettierrc.js', '*.js'],
        },
      },
    },
  },
  prettierplugin,
]);
