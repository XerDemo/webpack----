const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")

console.log(glob.sync(`${path.resolve(__dirname, './src')}/**/*`, { nodir: true }))


module.exports = {
  mode: 'production',
  devtool: false,
  // 优化配置
  optimization: {
    // 导入模块时, 分析模块中的哪些函数有被使用, 哪些函数没有被使用（tree shaking）
    usedExports: true,
    chunkIds: 'deterministic',
    // 分包插件: SplitChunksPlugin
    splitChunks: {
      chunks: "all", // 同步、异步导入的重复模块都被拆分出去
      minSize: 10,
      // 自己对需要进行拆包的内容进行分包
      cacheGroups: {
        utils: {
          test: /utils/,
          filename: "js/[id]_utils.js"
        },
        vendors: {
          // /node_modules/
          // window上面 /\
          // mac上面 /
          test: /[\\/]node_modules[\\/]/,
          filename: "js/[id]_vendors.js"
        }
      }
    },
    minimize: true,
    // 代码优化: TerserPlugin => 让代码更加简单 => Terser
    minimizer: [
      // JS压缩的插件: TerserPlugin
      new TerserPlugin({
        extractComments: false, // 版权有关的注释是否单独提取出来
        terserOptions: {
          compress: {
            arguments: true,
            unused: true
          },
          mangle: true, // 丑化
          // toplevel: false
          keep_fnames: true // 保留函数名
        }
      }),
      // CSS压缩的插件: CSSMinimizerPlugin
      new CSSMinimizerPlugin({
        // parallel: true
      })
    ],
  },
  plugins: [
    // 完成css的提取
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css',
      chunkFilename: 'css/[name]_[contenthash:8]_chunk.css'
    }),
    // 对CSS进行TreeShaking
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, { nodir: true }),
      safelist: function() {
        return {
          standard: ["body"]
        }
      }
    }),
    // 作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 对打包后的文件(js/css)进行压缩
    new CompressionPlugin({
      test: /\.(js|css)$/,
      algorithm: 'gzip'
    })
  ]
}
