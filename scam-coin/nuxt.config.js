module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'scam-coin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'http://3.37.88.98:8000', // API 서버 주소
  },

  plugins: [
    { src: '~/plugins/axios.js', mode: 'client' },
    { src: '~/plugins/toasted.js', mode: 'client' }
  ],

  css: [
    '@fortawesome/fontawesome-free/css/all.css'
  ]

}
