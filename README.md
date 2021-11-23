# karas(鸦)
A declarative JavaScript framework for RIA on Canvas/Svg/Webgl.

---
karas实现了一个微型浏览器引擎，同时扩充CSS/WAA在样式/动画上的标准，增强类似SVG的矢量标签描述语法，结合JSX/React的开发方式，形成一个对前端友好的RIA框架。

[![NPM version](https://img.shields.io/npm/v/karas.svg)](https://npmjs.org/package/karas)
![CI](https://github.com/karasjs/karas/workflows/CI/badge.svg)

[![logo](https://raw.githubusercontent.com/karasjs/karas/master/logo.png)](https://raw.githubusercontent.com/karasjs/karas/master/logo.png)

## Install
```
npm install karas
```

## Framework
[![framework](https://raw.githubusercontent.com/karasjs/karas/master/framework.png)](https://raw.githubusercontent.com/karasjs/karas/master/framework.png)

## API
* https://github.com/karasjs/karas/blob/master/api.md
* https://github.com/karasjs/karas/blob/master/csx.md

## Demo
* demo目录下是一个web端的演示教程示例，可直接本地预览
* `CSX`（扩展$矢量标签的JSX）预编译工具建议使用`babel-preset-karas`：https://github.com/karasjs/babel-preset-karas [![NPM version](https://img.shields.io/npm/v/babel-preset-karas.svg)](https://npmjs.org/package/babel-preset-karas)
* 在线预览：http://army8735.me/karasjs/karas/demo/

## Webpack config
```js
chainWebpack(config) {
  config.module.rule('exclude').exclude.add(/\.csx$/);
  config.module
    .rule('csx')
    .test(/\.csx$/)
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      babelrc: false,
      presets: [require.resolve('@babel/preset-env'), require.resolve('babel-preset-karas')],
    })
    .end();
},
```

# License
[MIT License]
