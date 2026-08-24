import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/* eslint-config-next 16 ships flat configs directly, so these are spread in
 * rather than wrapped in FlatCompat. The compat shim serialises the config to
 * validate it, which throws on the plugin object's circular reference. */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
]

export default config
