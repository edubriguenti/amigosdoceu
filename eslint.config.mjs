import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'out/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Imagens simples com onError/fallback são intencionais em alguns cards.
      '@next/next/no-img-element': 'warn',
      // Aspas e apóstrofos em textos em português.
      'react/no-unescaped-entities': 'warn',
    },
  },
]

export default config
