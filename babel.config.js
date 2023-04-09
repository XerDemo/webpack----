module.exports = {
  // 直接使用预设，可以避免手动安装大量插件
  presets: [
    ["@babel/preset-env", {
    }],
    ["@babel/preset-react"],
    ["@babel/preset-typescript", {
      corejs: 3,
      // useBuiltIns:设置polyfill，一般推荐使用usage，如果第三方报错改为entry，设为false表示不使用polyfill
      useBuiltIns: "usage",
    }]
  ]
}
