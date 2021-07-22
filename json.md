# 动态json格式
json和代码其实是一一对应的，二者完全等价，只是json可以动态加载，但无法用函数和编程等高级功能。
```tsx
// csx写法
karas.render(
  <canvas width={100} height={100}>
    <div style={{color:'#F00'}}>Hello World</div>
  </canvas>,
  '#selector'
);
// json写法
karas.parse({
  tagName: 'canvas',
  props: {
    width: 100,
    height: 100,
  },
  children: [{
    tagName: 'div',
    props: {
      style: {
        color: '#F00',
      },
    },
    children: ['Hello World'],
  }],
}, '#selector');
```
json其实只包含4个基本key，对应`CSX`写法的名称。
```ts
{
  tagName: string, // 标签名
  props?: Object, // props即属性，常见style和矢量属性在其内。
  children?: Array<Object>, // 孩子节点
  animate?: Object/Array<{ value: Object/Array, options: Object }>, // WAA执行动画的声明
}
```
例：
```tsx
// csx写法
let root = karas.render(
  <canvas width={100} height={100}>
    <div style={{color:'#F00'}}>Hello World</div>
  </canvas>,
  '#selector'
);
root.animate([
  {},
  {
    translateX: 100
  },
], {
  duration: 1000,
});
// json写法
karas.parse({
  tagName: 'canvas',
  props: {
    width: 100,
    height: 100,
  },
  children: [{
    tagName: 'div',
    props: {
      style: {
        color: '#F00',
      },
    },
    children: ['Hello World'],
    animate: [
      {
        value: [
          {},
          {
            transateX: 100,
          },
        ],
        options: {
          duration: 1000,
        },
      },
    ],
  }],
}, '#selector');
```
~~json有压缩格式，即把常见的样式/动画的key简写别名，使得整体内容大小更短，但不易于阅读。缩写只针对了css样式的键名，以及动画的2个属性`value`和`options`，还有`options`下的内容，动画中的关键帧同样是样式。因为是驼峰结构，所以普通情况下缩写就是驼峰单词的缩写形式。当出现冲突时，有专门覆盖定义：https://github.com/karasjs/karas/blob/master/src/parser/abbr.js 。所有缩写共享一个冲突定义，下面示例2种是等价的：~~
```ts
karas.parse({
  tagName: 'div',
  props: {
    style: {
      color: '#F00',
    },
  },
  animate: [
    {
      value: [
        {
          translateX: 0,
        },
        {
          translateX: 100,
        },
      ],
      options: {
        duration: 1000,
        iterations: 2,
      },
    },
  ],
});
// 缩写key
karas.parse({
  tagName: 'div',
  props: {
    style: {
      c: '#F00',
    },
  },
  animate: [
    {
      v: [
        {
          tx: 0,
        },
        {
          tx: 100,
        },
      ],
      o: {
        d: 1000,
        i: 2,
      },
    },
  ],
});
```
工具导出的json能看到`library`字段，这是编辑器专用，为了复用，所有的元件（可理解为一个dom类）均在library中，且有唯一`id`标识，json中使用`libraryId`来引用并实例化元件。实例化的json有`init`属性来覆盖`props`属性，相当于创建对象并传入初始化参数。一般情况下，实例化无法覆盖`children`和`animate`，后面会有特殊方式。
```ts
let json = {
  tagName: 'canvas',
  children: [
    {
      libraryId: 0,
      init: {
        style: {
          background: '#F00',
        },
      },
    },
    {
      libraryId: 0,
      init: {
        style: {
          background: '#00F',
        },
      },
    },
  ],
  library: {
    id: 0,
    tagName: 'div',
    props: {
      style: {
        width: 100,
        height: 100,
      },
    },
    children: ['text'],
  },
};
```
工具导出的json还能看到`var-`开头的字段，会出现在`props`和`style`中，即插槽变量，在`karas.parse()`时可根据id传入变量替换对应的属性。另外想要替换某个特殊字段如`children`和`animate`，会看到特殊的如`var-children.0`的字段，数字标明索引。
```ts
let json = {
  tagName: 'canvas',
  children: [
    {
      libraryId: 0,
    },
  ],
  library: {
    id: 0,
    tagName: 'div',
    props: {
      style: {
        background: '#F00',
        'var-background': {
          id: 'color',
          desc: '自定义背景色',
        },
      },
    },
    children: [],
    'var-children.0': {
      id: 'custom',
      desc: '自定义children',
    },
  },
};
karas.parse(json, {
  vars: {
    color: '#00F',
    custom: 'text'
  },
});
```
