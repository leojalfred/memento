import tailwindConfig from '@/tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

const config = resolveConfig(tailwindConfig)
export const colors = config.theme.colors

export const colorPairs: [string, string][] = [
  [colors.red[600], colors.orange[300]],
  [colors.orange[600], colors.amber[300]],
  [colors.amber[600], colors.yellow[300]],
  [colors.lime[600], colors.green[300]],
  [colors.green[600], colors.emerald[300]],
  [colors.emerald[600], colors.teal[300]],
  [colors.teal[600], colors.cyan[300]],
  [colors.cyan[600], colors.sky[300]],
  [colors.sky[600], colors.blue[300]],
  [colors.blue[600], colors.indigo[300]],
  [colors.indigo[600], colors.violet[300]],
  [colors.violet[600], colors.purple[300]],
  [colors.purple[600], colors.fuchsia[300]],
  [colors.fuchsia[600], colors.pink[300]],
  [colors.pink[600], colors.rose[300]],
  [colors.rose[600], colors.red[300]],
  [colors.slate[600], colors.stone[300]],
  [colors.orange[600], colors.red[300]],
  [colors.amber[600], colors.orange[300]],
  [colors.yellow[600], colors.amber[300]],
  [colors.green[600], colors.lime[300]],
  [colors.emerald[600], colors.green[300]],
  [colors.teal[600], colors.emerald[300]],
  [colors.cyan[600], colors.teal[300]],
  [colors.sky[600], colors.cyan[300]],
  [colors.blue[600], colors.sky[300]],
  [colors.indigo[600], colors.blue[300]],
  [colors.violet[600], colors.indigo[300]],
  [colors.purple[600], colors.violet[300]],
  [colors.fuchsia[600], colors.purple[300]],
  [colors.pink[600], colors.fuchsia[300]],
  [colors.rose[600], colors.pink[300]],
  [colors.red[600], colors.rose[300]],
  [colors.stone[600], colors.slate[300]],
]
