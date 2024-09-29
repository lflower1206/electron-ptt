import globals from 'globals'
import pluginJs from '@eslint/js'
import tsLint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact
    },
    languageOptions: {
      ...pluginReact.configs.recommended.languageOptions,
      globals: {
        ...globals.browser, ...globals.node
      },
    }
  },
  pluginJs.configs.recommended,
  ...tsLint.configs.recommended,
]
