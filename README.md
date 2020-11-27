# karas(鸦)
A flexible JavaScript framework for RIA on Canvas/Svg.

[![NPM version](https://img.shields.io/npm/v/karas.svg)](https://npmjs.org/package/karas)
[![Build Status](https://api.travis-ci.com/karasjs/karas.svg?branch=master&status=started)](https://travis-ci.com/karasjs/karas)

[![logo](https://raw.githubusercontent.com/karasjs/karas/master/logo.png)](https://raw.githubusercontent.com/karasjs/karas/master/logo.png)

## INSTALL
```
npm install karas
```

## Framework
[![framework](https://raw.githubusercontent.com/karasjs/karas/master/demo/framework.png)](https://raw.githubusercontent.com/karasjs/karas/master/demo/framework.png)

## API
* https://github.com/karasjs/karas/blob/master/api.md
* https://github.com/karasjs/karas/blob/master/csx.md

## Demo
* demo目录下是一个web端的演示教程示例，可直接本地预览
* `csx`预编译工具建议使用`babel-preset-karas`：https://github.com/karasjs/babel-preset-karas [![NPM version](https://img.shields.io/npm/v/babel-preset-karas.svg)](https://npmjs.org/package/babel-preset-karas)
* 在线预览：http://army8735.me/karasjs/karas/demo/

## webpack config
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
