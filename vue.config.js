const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        pathRewrite: {
          '^/api': ''
        }
      },
      '/pingfen': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/pingfen': '/pingfen'
        }
      },
      '/sit-api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/sit-api': ''
        }
      },
      '/prod-api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/prod-api': ''
        }
      }
    }
  }


})
