const path = require('path');

module.exports = {
  publicPath: './',
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set(
      'bn.js',
      path.resolve(path.join(__dirname, 'node_modules', 'bn.js'))
    );
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: { loader: 'raw-loader' }
        }
      ]
    }
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        pathRewrite: {
          '/api': '/api'
        }
      }
    }
  }
};
