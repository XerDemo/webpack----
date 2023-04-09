const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const devConfig = require("./dev.config");
const prodConfig = require("./prod.config");

const getCommonConfig = function (isProdution) {
  return {
    // 入口,默认值: ./src/index.js
    entry: {
      // index: './src/adminSystem/index.js',
      main: "./src/main.js",
    },
    // 出口
    output: {
      clean: true, // 重新打包时，删除上次打包的文件夹 ，不需要配置clean-webpack-plugin插件
      path: path.resolve(__dirname, "../build"), // 打包到的目录
      filename: "js/[name]_[contenthash:8]_bundle.js",
      chunkFilename: "js/[name]_[contenthash:8]_chunk.js", // 单独针对分包的文件进行命名
      // publicPath: 'http://coderwhycdn.com/'  // 配置CDN地址
    },
    resolve: {
      // import ‘xxx/index’ 自动拼接扩展名
      extensions: [".js", ".json", ".wasm", ".jsx", ".ts", ".jpeg"],
      // 设置别名
      alias: {
        "@": path.resolve(__dirname, "../src"),
        utils: path.resolve(__dirname, "../src/utils"),
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 生产环境单独将css抽取出来，开发坏境就用style-loader
            // 多个loader加载顺序，从后往前
            isProdution ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(js|ts|jsx|tsx)$/,
          use: ["babel-loader"],
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          // 1.打包两张图片, 并且这两张图片有自己的地址, 将地址设置到img/bgi中
          // 缺点: 多图片加载的两次网络请求
          // type: "asset/resource",

          // 2.将图片进行base64的编码, 并且直接编码后的源码放到打包的js文件中
          // 缺点: 造成js文件非常大, 下载js文件本身消耗时间非常长, 造成js代码的下载和解析/执行时间过长
          // type: "asset/inline"

          // 3.合理的规范:
          // 3.1.对于小一点的图片, 可以进行base64编码
          // 3.2.对于大一点的图片, 单独的图片打包, 形成url地址, 单独的请求这个url图片
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 60 * 1024,
            },
          },
          generator: {
            // name: 指向原来的图片名称
            // ext: 扩展名
            // hash: webpack生成的hash
            filename: "img/[name]_[contenthash:8][ext]",
          },
        },
      ],
    },
    plugins: [
      // 在打包目录生成index.html
      new HtmlWebpackPlugin({
        template: "./index.html",
        cache: true,
        minify: isProdution
          ? {
              // 移除注释
              removeComments: true,
              // 移除属性
              removeEmptyAttributes: true,
              // 移除默认属性
              removeRedundantAttributes: true,
              // 折叠空白字符
              collapseWhitespace: true,
              // 压缩内联的CSS
              minifyCSS: true,
              // 压缩JavaScript
              minifyJS: {
                mangle: {
                  toplevel: true,
                },
              },
            }
          : false,
      }),
      // 定义一些全局的常量，默认注入了process.env.NODE_ENV:可以用来判断当前坏境是生产还是开发
      new DefinePlugin({
        BASE_URL: './'
      }),
    ],
  };
};

// webpack允许导出一个函数
module.exports = function (env) {
  const isProduction = env.production;
  let mergeConfig = isProduction ? prodConfig : devConfig;
  return merge(getCommonConfig(isProduction), mergeConfig);
};
