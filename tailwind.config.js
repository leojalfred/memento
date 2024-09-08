const { platformSelect } = require('nativewind/theme')
const colors = require('tailwindcss/colors')

delete colors['lightBlue']
delete colors['warmGray']
delete colors['trueGray']
delete colors['coolGray']
delete colors['blueGray']

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors,
    extend: {
      fontFamily: {
        cp: platformSelect({
          ios: 'CourierPrime-Regular',
          android: 'CourierPrime_400Regular',
        }),
        'cp-bold': platformSelect({
          ios: 'CourierPrime-Bold',
          android: 'CourierPrime_700Bold',
        }),
      },
    },
  },
  plugins: [],
}
