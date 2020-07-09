/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        base: {
          light: '#FFF5E0',
          default: '#FFECC3',
          dark: '#DAC089',
          darkness: '#B49653',
        },
        paint: {
          'leather-red': '#a03640',
          red: '#B91722',
          bule: '#09537C',
          green: '#677F58',
          orange: '#E39827',
          pink: '#D38B93',
          yellow: '#E1B453',
          skybule: '#5C899D',
          gray: '#B1B0B7',
          brown: '#674129',
          black: '#221714',
        },
      },
      height: {
        'screen-1/5': '20vh',
      },
      maxHeight: {
        '0': '0',
        'screen-1/5': '20vh',
      },
      minHeight: {
        '0': '0',
        'screen-1/5': '20vh',
      },
    },
  },
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/components/**/*.vue',
      './src/layouts/**/*.vue',
      './src/pages/**/*.vue',
      './src/plugins/**/*.ts',
      'nuxt.config.ts',
    ],
  },
}
