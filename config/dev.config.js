const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')


module.exports = {
  // mode:开发模式，将对应的process.env.NODE_EN设为development
  mode: 'development',
  // devtool: 'source-map', //生产环境默认为false
  // 开启本地服务器，默认hot：true启动热更新
  devServer: {
    // 打包后build/index.html中又使用了一些其他的资源，从哪里找
    // static默认值：public,这也是为什么脚手架都有public的原因
    static: ['public', 'content'],
    port: 3000,
    compress: true, // 开启gzip压缩
    // 配置代理服务器，用来解决跨域
    // 比如loaclhost:8000访问localhost:9000
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        pathRewrite: {
          '^/api': ''
        },
        // 如果服务器对请求头的host做了校验，我们要将changeOrigin设为true，可以将host值改为target的值
        changeOrigin: true
      }
    },
    // 解决SPA页面中手动刷新页面，返回404的错误
    // 比如在127.0.0.1:3000点击详情页跳转到127.0.0.1:3000/detail，页面其实是没有刷新的，是通过路由进行切换的
    // 但是此时如果在详情页 127.0.0.1:3000/detail 手动刷新页面，会去后端请求对应的资源，但是后端压根就没有这个资源，所以会报404错误
    // 将historyApiFallback设为true，刷新页面返回404时，自动返回index.html内容然后将/detail看成histor的一部分去动态的切换
    historyApiFallback: true
  },
  plugins: [
  ]
}
