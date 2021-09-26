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
```tsx
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
```tsx
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
~~工具导出的json还能看到`var-`开头的字段，会出现在`props`和`style`中，即插槽变量，在`karas.parse()`时可根据id传入变量替换对应的属性。另外想要替换某个特殊字段如`children`和`animate`，会看到特殊的如`var-children.0`的字段，数字标明索引。~~
```tsx
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
新的插槽定义变成了`vars`标识，同时用子属性`member`表达替换的成员属性，可为数组递归下去。特别的，json的直接子属性上定义的`vars`可以替换`library`中的内容，此时可以用id替代索引。
```tsx
let json = {
  tagName: 'canvas',
  children: [
    {
      libraryId: 'lid',
    },
  ],
  library: [{
    id: 'lid',
    tagName: 'div',
    props: {
      style: {
        background: '#F00',
        vars: [{
          id: 'color',
          member: 'background', // 只有1个直接属性定义key即可
        }],
      },
    },
    children: [],
    vars: [{
      id: 'custom',
      member: ['children', 0], // 需要替换children的第0个所以是个数组
    }],
  }, {
    tagName: 'img',
    props: {
      src: 'xxx',
      vars: {
        id: 'url',
        member: 'src', // 单个vars可以不用数组直接用对象
      },
    },
  }],
  vars: [{
    id: 'lib',
    member: ['library', 'lid',] // 特殊的可以用lid访问library的直接内容
  }],
};
karas.parse(json, {
  vars: {
    color: '#00F',
    custom: 'text',
    url: 'xxx',
    lib: {},
  },
});
```
特别的，对于`loadAndParse`方法，json直接子属性新增`fonts`和`components`来通过`url`定义远程加载的字体和自定义组件。字体的`data`为字体信息。自定义组件的`tagName`做了默认约定，需要自己执行同名注册，或暴露同名变量给全局访问自动注册。同时组件还有`reload`申明强制加载，即便是发现已经注册过的同名组件。
```tsx
karas.loadAndParse(
  {
    "tagName": "canvas",
    "props": {
      "width": 100,
      "height": 100
    },
    "children": [
      {
        "tagName": "Custom",
        "props": {
          "style": {
            "fontFamily": "DINPro"
          }
        }
      }
    ],
    "fonts": [
      {
        "fontFamily": "DINPro",
        "data": {
          "emSquare": 2000,
          "ascent": 1200,
          "descent": 800,
          "lineGap": 60
        },
        "url": "xxx" // 加载的url
      }
    ],
    "components": [
      {
        "tagName": "Custom",
        "url": "xxx", // 加载的url
        "reload": true // 强制加载，即便已经注册
      }
    ]
  },
  '#selector',
  {
    callback(root) {
      console.log(root);
    }
  }
);
```
另外，json直接子属性新增`abbr`字段，当为`false`时强制不使用缩写功能，等同于`parse`的第2个参数传入`abbr`为`false`。建议始终使用，缩写已经不建议。
```tsx
karas.parse({
  tagName: 'div',
  props: {},
  children: [],
  abbr: false, // 等同于下面的
}, {
  abbr: false, // 等同于上面的
});
```
