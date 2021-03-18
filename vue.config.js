const CompressionPlugin = require('compression-webpack-plugin') // 引入gzip压缩插件
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index Page',
    },
    gis: {
      entry: 'src/gis.js',
      template: 'public/gis.html',
      filename: 'gis.html',
      title: 'GIS Page',
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.0.2.13:8080/',
        ws: true,
        changeOrigin: true,
      },
      // '/auth': {
      //   target: 'http://www.meter-iot.cn/api/',
      //   ws: true,
      //   changeOrigin: true,
      // },
      '/auth': {
        target: 'http://www.meter-iot.cn/api',
        ws: true,
        changeOrigin: true,
      },
      '/open': {
        target: 'http://www.meter-iot.cn/api',
        ws: true,
        changeOrigin: true,
      }
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false // 是否删除原文件
      })
    ]
  },
}
