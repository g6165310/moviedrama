
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/moviedrama' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/scss/foundation/_config.scss";
            @import "@/scss/foundation/_helpers.scss";
            `
      },
      scss: {
        prependData: `
            @import "@/scss/foundation/_config.scss";
            @import "@/scss/foundation/_helpers.scss";
            `
      }
    }
  }
}
