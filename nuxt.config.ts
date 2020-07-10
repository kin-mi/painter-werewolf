import { Configuration } from '@nuxt/types'
require('dotenv').config()

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
    title: 'お絵かき人狼',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '絵を描きながら人狼を探し当てるゲームです。',
      },
      { name: 'robots', content: 'noindex' },
      { name: 'robots', content: 'nofollow' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/messenger',
    '~/plugins/room',
    '~/plugins/gameManager',
    '~/plugins/canvas',
  ],
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
    '@nuxtjs/dayjs',
    'vue-scrollto/nuxt',
    'nuxt-webfontloader',
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
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
      databaseURL: process.env.FIREBASE_DATABASEURL!,
      projectId: process.env.FIREBASE_PROJECT_ID!,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.FIREBASE_APP_ID!,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedMutation: 'auth/ON_AUTH_STATE_CHANGED_MUTATION',
        },
      },
      firestore: true,
      realtimeDb: true,
    },
  },
  /**
   * Web Fonts module configuration
   * See https://github.com/Developmint/nuxt-webfontloader
   */
  webfontloader: {
    // add Google Fonts as "custom" | workaround required
    custom: {
      families: ['Noto Sans JP:n3,n4', 'Slabo'],
      urls: [
        // for each Google Fonts add url + options you want
        // here add font-display option
        'https://fonts.googleapis.com/css?family=Noto+Sans+JP:wght@300,400&display=swap',
        'https://fonts.googleapis.com/css?family=Slabo+27px&display=swap',
      ],
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
