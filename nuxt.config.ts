import { Configuration } from '@nuxt/types'
const config: Configuration = {
  srcDir: 'src',
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['~/plugins/messenger', '~/plugins/room'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://nuxt-typed-vuex.danielcroe.com/
    'nuxt-typed-vuex',
  ],
  /**
   ** Nuxt.js TypeScript Build options
   ** See: https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
   */
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://firebase.nuxtjs.org/guide/introduction/
    '@nuxtjs/firebase',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { baseURL: 'http://localhost:3000' },
  /**
   ** Firebase module configuration
   ** See https://firebase.nuxtjs.org/guide/options/
   */
  firebase: {
    config: {
      apiKey: 'AIzaSyAIT1MOCm4QlvbLITDmANmcIPdHVWQxaEg',
      authDomain: 'painter-werewolf.firebaseapp.com',
      databaseURL: 'https://painter-werewolf.firebaseio.com',
      projectId: 'painter-werewolf',
      storageBucket: 'painter-werewolf.appspot.com',
      messagingSenderId: '537299849059',
      appId: '1:537299849059:web:42065fb5d016ee520d8d56',
      measurementId: 'G-3RQB0Y6LZ8',
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'auth/ON_AUTH_STATE_CHANGED_MUTATION',
          // onAuthStateChangedAction: 'onAuthStateChangedAction'
        },
      },
      firestore: true,
      realtimeDb: true,
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: [/typed-vuex/],
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ]
      },
    },
  },
}

export default config
