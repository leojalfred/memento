import tailwindConfig from '@/tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

const config = resolveConfig(tailwindConfig)
export default config.theme.colors
