# 全局
`karas`是暴露在`window`全局下的变量，可以直接访问。当采用模块引入（如ES6或npm）时，它也是作为模块的引用变量。

```js
window.karas; // js
import karas from 'karas';  // es module
var karas = require('karas'); // cjs
```

## karas

<a name="version"></a>
### version
* **类型** `String`
* **说明**  
当前karas的版本，即`package.json`的`version`字段。
* **示例**
```jsx
console.log(karas.version);
```

### debug
* **类型** `boolean`
* **说明**  
  是否开启debug模式，开启后离屏canvas和img都会被添加到body上以便观察。默认关闭。
* **示例**
```jsx
karas.debug = true;
```

<a name="render"></a>
### render
* **类型** `Function`
* **参数**
  * root `Root`  
  canvas/svg根节点，VirtualDom的根，类似HTML的body节点。详见[Root](#Root)。
  * dom `DOM/String`
  HTML节点或者SELECTOR选择器，真实DOM，karas将最终渲染在此dom对象上。如果是普通节点（如div）将在其下生成新的root节点（如canvas），如果是canvas/svg节点将直接利用。不存在或者root不匹配会报错。
* **说明**  
入口方法，将需要渲染的数据最终绘制到dom对象上，根据root的tagName自动使用canvas/svg模式。
* **示例**
```jsx
karas.render(
  <canvas>Hello Karas on canvas!</canvas>,
  '#selector'
);
karas.render(
  <svg>Hello Karas on svg!</svg>,
  document.body
);
```

<a name="parse"></a>
### parse
* **类型** `Function`
* **参数**
  * json `JSON`
  对应csx的json数据格式，一般是工具生成，最终会转化为同等csx代码。
  * dom `DOM/String`
  同[render()](#render)的dom参数。
  * options `Object`
  整体动画初始化参数，可选，详情见下文。
* **说明**  
入口方法，同[render()](#render)类似，接收的json可以动态化下发，更加灵活，但也缺少了一些编程本身的功能（如不能写逻辑和函数）。
* **示例**
```jsx
let root = karas.parse(
  {
    "tagName": "canvas",
    "props": {
      "width": 100,
      "height": 100
    },
    "children": ["Hello karas!"]
  },
  '#selector'
);
```

#### options
* **类型** `Object`
* **说明**
可配`autoPlay`是否默认播放，可配`controller`传入一个自定义总控制器，可配`vars`传入变量hash，可配`abbr`为false禁用缩写。
* **示例**
```jsx
let root = karas.parse(
  someJson,
  '#selector',
  {
    autoPlay: false, // 默认播放
    controller: new karas.animate.Controller(),
    vars: {
      color: '#F00',
      onClick: function() {
        console.log('click');
      },
    },
    abbr: false,
  }
);
```

<a name="loadAndParse"></a>
### loadAndParse
* **类型** `Function`
* **参数**  
同[parse()](#parse)方法，`options`多了一个`callback`。因为是异步无法直接返回`Root`，所以用回调的方式获得。
* **说明**  
同[parse()](#parse)方法，只是json中的`imgs`、`fonts`和`components`字段可以加载字体和自定义组件，等它们全部加载成功后再解析渲染。自定义组件的`tagName`做了默认约定，需要自己执行同名注册，或暴露同名变量给全局访问自动注册。
* **示例**
```jsx
karas.parse(
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
    "imgs": [
      {
        "url": "xxx"
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
        "url": "xxx"
      }
    ],
    "components": [
      {
        "tagName": "Custom",
        "url": "xxx"
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

<a name="Event"></a>
### Event
* **类型** `class`
* **说明**  
一个简单的事件基类，[Root](#Root)、[Component](#Component)均实现了此类，可以发送和侦听自定义事件。详见[自定义事件](#自定义事件)。

<a name="mode"></a>
### mode
* **类型** `int`
* **枚举**
  * CANVAS `0`
  * SVG `1`
  * WEBGL `2`
* **说明**  
渲染类型的枚举值，在覆盖render()方法时会作为首参传入，表明当前根节点类型。一般在自定义组件、自定义矢量类型时用到。
* **示例**
```jsx
class Component extends karas.Component {
  render(renderMode) {
    if(renderMode === karas.mode.CANVAS) {
      // 处理渲染canvas的逻辑
    }
    else if(renderMode === karas.mode.SVG) {
      // 处理渲染svg的逻辑
    }
    else if(renderMode === karas.mode.WEBGL) {
      // 处理渲染webgl的逻辑
    }
  }
}
```

### Node
* **类型** `class`
* **说明**  
所有节点基类，[Dom](#Dom)、[Text](#Text)均实现了此类。详见[Node](#Node)。

### Text
* **类型** `class`
* **说明**  
文本节点。详见[Text](#Text)。

### Xom
* **类型** `class`
* **说明**  
所有非Text节点的基类，[Dom](#Dom)、[Geom](#Geom)均实现了此类。详见[Xom](#Xom)。

### Dom
* **类型** `class`
* **说明**  
所有dom节点的基类，[Img](#Img)实现了此类。详见[Img](#Img)。

### Img
* **类型** `class`
* **说明**  
图片节点类。详见[Img](#Img)。

### Component
* **类型** `class`
* **说明**  
组件的基类，混入了[Event](#Event)。详见[Component](#Component)。
  
### util
* **类型** `Object`
* **说明**  
一组工具方法的集合，用以附加处理工具类的方法。一般情况下开发用不到。详见[工具集](#工具集)。
  
### inject
* **类型** `Object`
* **说明**  
一组注入方法的集合，用以注入实现非普通浏览器环境下的必要方法（如小程序、native开发）。一般情况下开发用不到。详见[注入](#注入)。
  
### style
* **类型** `Object`
* **说明**  
公开的style包下的对象集合，用以处理样式相关的方法。一般情况下开发用不到。详见[style包](#style包)。

<a name="parser"></a>
### parser
* **类型** `Object`
* **说明**  
  公开的parser包下的对象集合，用以处理动态json相关的方法。一般情况下开发用不到。详见[parser包](#parser包)。

<a name="animate"></a>
### animate
* **类型** `Object`
* **说明**  
  公开的animate包下的对象集合，用以处理动画相关的方法。一般情况下开发用不到。详见[animate包](#animate包)。

<a name="math"></a>
### math
* **类型** `Object`
* **说明**  
  公开的math包下的对象集合，用以处理数学相关的方法。一般情况下开发用不到。详见[math包](#math包)。

<a name="refresh"></a>
### refresh
* **类型** `Object`
* **说明**  
  公开的refresh包下的对象集合，用以处理刷新缓存相关的方法。一般情况下开发用不到。详见[refresh包](#refresh包)。

<a name="enums"></a>
### enums枚举
* **类型** `Object`
* **说明**  
  公开的枚举类型，因v8特殊优化的关系，一些常用的属性以索引下标的形式存储，而非常见的string的key。

#### STYLE_KEY
* **类型** `Object`
* **说明**  
  大写常量做key，数字为值，样式的枚举。

#### STYLE_R_KEY
* **类型** `Object`
* **说明**  
  数字做key，大写常量为值，样式的反枚举。

#### STYLE_RV_KEY
* **类型** `Object`
* **说明**  
  数字做key，小写style样式键为值。

#### STYLE_V_KEY
* **类型** `Object`
* **说明**  
  小写style样式键做key，数字为值。

<a name="Node"></a>
## Node
Xom/Text的基类，抽象共有部分。所有节点均派生于它。

### 类属性property

#### x
* **类型** `Number` 只读
* **说明**  
x坐标。

#### y
* **类型** `Number` 只读
* **说明**  
y坐标。

#### ox
* **类型** `Number` 只读
* **说明**  
x偏移坐标，因relative造成。

#### oy
* **类型** `Number` 只读
* **说明**  
y偏移坐标，因relative造成。

#### width
* **类型** `Number` 只读
* **说明**  
宽度。

#### height
* **类型** `Number` 只读
* **说明**  
高度。

#### clientWidth
* **类型** `Number` 只读
* **说明**  
内部宽度，包含padding。注意节点display:none时为0。

#### clientHeight
* **类型** `Number` 只读
* **说明**  
内部高度，包含padding。注意节点display:none时为0。
  
#### offsetWidth
* **类型** `Number` 只读
* **说明**  
  节点宽度，包含padding+border。注意节点display:none时为0。

#### offsetHeight
* **类型** `Number` 只读
* **说明**  
  节点高度，包含padding+border。注意节点display:none时为0。

#### style
* **类型** `Object` 只读
* **说明**  
标签属性中传入的style样式集合。

#### currentStyle
* **类型** `Object` 只读
* **说明**  
当前的style样式集合，格式化后的。如果有动画，更新的样式反应在`currentStyle`上，而不会修改原始`style`引用。

#### computedStyle
* **类型** `Object` 只读
* **说明**  
当前的style样式集合，计算后的，类似window.getComputedStyle()。

#### prev
* **类型** `Node` 只读
* **说明**  
前面一个相邻的兄弟节点。

#### next
* **类型** `Node` 只读
* **说明**  
后面一个相邻的兄弟节点。

#### parent
* **类型** `Xom` 只读
* **说明**  
直接父亲节点。

#### domParent
* **类型** `Xom` 只读
* **说明**  
真实父亲节点，[Component](#Component)的[shadowRoot](#shadowRoot)没有`parent`，因此`domParent`会指向`Component`本身的`parent`。

#### root
* **类型** `Root` 只读
* **说明**  
根节点。详见[Root](#Root)。

#### host
* **类型** `Root/Component` 只读
* **说明**  
局部根节点，即ref所属的根节点。当出现在一个组件内部时，通过`Component.ref.a`访问到自己，是属于组件的。当直接出现在Root下时，通过`Root.ref.a`访问到自己，是属于Root。详见[Root](#Root)、[Component](#Component)。

#### bbox
* **类型** `Array<Number>` 只读
* **说明**  
所占矩形坐标框，不包含margin。

#### baseLine
* **类型** `Number` 只读
* **说明**  
baseLine，字母x的下边线位置。

<a name="Text"></a>

## Text
文字类，处理有关文本的数据。[Node](#Node)的派生类。

### 类属性property

#### content
* **类型** `String` 读写
* **说明**  
读取/设置文本的内容。

#### charWidth
* **类型** `Number` 只读
* **说明**  
内容中最大字符宽度。

#### charWidthList
* **类型** `Array<Number>` 只读
* **说明**  
内容的所有字符宽度列表。

#### textWidth
* **类型** `Number` 只读
* **说明**  
内容的字符宽度总和。

### 类方法method

#### updateContent
* **类型** `Function`
* **参数**
  * content `String`
  * cb `Function`
    回调。
* **说明**  
异步更新文本，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">1</div>
  </canvas>,
  '#selector'
);
root.ref.div.children[0].updateContent('2', function() {
  console.log('updateContent');
});
```

<a name="Xom"></a>
## Xom
Dom/Geom的基类，抽象共有部分。[Node](#Node)的派生类。

### html属性attribute

#### mask
* **类型** `boolean` 只读
* **说明**  
是否作为遮罩影响前面兄弟节点。

#### clip
* **类型** `boolean` 只读
* **说明**  
是否作为反向遮罩影响前面兄弟节点。优先级比mask高。

#### cacheAsBitmap
* **类型** `boolean` 读写
* **说明**  
是否开启节点位图缓存模式。

### 类属性property

#### tagName
* **类型** `String` 只读
* **说明**  
标签名。

#### sx
* **类型** `Number` 只读
* **说明**  
x坐标+偏移坐标。

#### sy
* **类型** `Number` 只读
* **说明**  
y坐标+偏移坐标。

#### outerWidth
* **类型** `Number` 只读
* **说明**  
外部宽度，包含margin、border、padding。注意节点display:none时为0。

#### outerHeight
* **类型** `Number` 只读
* **说明**  
外部高度，包含margin、border、padding。注意节点display:none时为0。

#### listener
* **类型** `Object` 只读
* **说明**  
所有onXxx侦听存储的hash，一般开发用不到。

#### matrix
* **类型** `Array<Number>` 只读
* **说明**  
css标准的transform最终计算值，一维6为数组表达，相对于父元素。

#### matrixEvent
* **类型** `Array<Number>` 只读
* **说明**  
canvas标准的transform最终计算值，一维6为数组表达，相对于根元素。

#### renderMatrix
* **类型** `Array<Number>` 只读
* **说明**  
svg标准的transform最终计算值，一维6为数组表达，相对于父元素。

#### animationList
* **类型** `Array<Animation>` 只读
* **说明**  
当前的动画队列。详见[Animation](#Animation)。

#### isShadowRoot
* **类型** `boolean` 只读
* **说明**  
是否是[Component](#Component)的shadowRoot。

#### isDestroyed
* **类型** `boolean` 只读
* **说明**  
是否已被销毁。

#### cacheAsBitmap
* **类型** `boolean` 读写
* **说明**  
是否开启节点位图缓存模式。

### 类方法method

### render
* **类型** `Function`
* **参数**
  * renderMode `Number`
    渲染模式枚举。
  * refreshLevel `Number`
    渲染等级。
  * ctx `Object`
    渲染上下文，canvas/webgl即ctx，svg为特殊Defs类型。
  * cache `Number`
    缓存模式，见Cache的枚举。
  * dx `Number`
    x偏移，可选，默认为0。
  * dy `Number`
    y偏移，可选，默认为0。
* **说明**  
节点默认实现的渲染方法，可被覆盖。

#### getComputedStyle
* **类型** `Function`
* **参数**
  * key `String/Array<String>`
    想要获取的样式键名，可为空，默认全部。
* **说明**  
获取当前计算好的样式。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div style={{width: 100, height: 100}} ref="div"/>
  </canvas>,
  '#selector'
);
console.log(root.ref.div.getComputedStyle().width); // 100
console.log(root.ref.div.getComputedStyle('width').width); // 等同
console.log(root.ref.div.getComputedStyle(['width']).width); // 等同
```

#### getBoundingClientRect
* **类型** `Function`
* **参数**
  * includeBbox `Boolean`
  是否包含扩展bbox，默认否仅考虑节点本身盒子。一些样式如filter会扩展范围，用bbox更为精确。
* **说明**  
  获取当前节点距离左上角的矩形区域坐标。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div style={{width: 100, height: 100, translateX: 100, rotate: 1}} ref="div"/>
  </canvas>,
  '#selector'
);
console.log(root.ref.div.getBoundingClientRect()); // {"left":99.13499492031626,"top":-0.8650050796837405,"right":200.86500507968373,"bottom":100.86500507968374}
```

#### animate
* **类型** `Function`
* **参数**
  * list `Array<Object>`
  动画列表。
  * options `Object`
  动画参数
* **说明**  
开始执行一段动画并将结果存入animateList中。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <$rect style={{width: 100, height:100}} ref="rect"/>
  </canvas>,
  '#selector'
);
root.ref.rect.animate([
  {
    "translateX": 0
  },
  {
    "translateX": 100
  },
], {
  duration: 1000,
});
```

#### removeAnimate
* **类型** `Function`
* **参数**
  * target `Animation`
  动画对象。
* **说明**  
取消并从animateList中移除一段动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <$rect style={{width: 100, height:100}} ref="rect"/>
  </canvas>,
  '#selector'
);
let animate = root.ref.rect.animate([
  {
    "translateX": 0
  },
  {
    "translateX": 100
  },
], {
  duration: 1000,
});
root.ref.rect.removeAnimate(animate);
```

#### clearAnimate
* **类型** `Function`
* **参数**
  * target `Animation`
  动画对象
* **说明**  
取消所有动画并清空animateList。
  
#### frameAnimate
* **类型** `Function`
* **参数**
  * cb `Function`
    动画回调。
* **说明**  
  开始执行一段帧动画，在节点销毁时自动停止。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <$rect style={{width: 100, height:100}} ref="rect"/>
  </canvas>,
  '#selector'
);
root.ref.rect.frameAnimate(function(delta) {
  console.log(delta);
});
```

#### removeFrameAnimate
* **类型** `Function`
* **参数**
  * cb `Function`
    动画回调。
* **说明**  
手动移除一个帧动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <$rect style={{width: 100, height:100}} ref="rect"/>
  </canvas>,
  '#selector'
);
let cb = root.ref.rect.frameAnimate(function(delta) {
  console.log(delta);
});
root.rect.removeFrameAnimate(cb);
```

#### clearFrameAnimate
* **类型** `Function`
* **说明**  
移除自己所有的帧动画。

#### updateStyle
* **类型** `Function`
* **参数**
  * style `Object`
  更新的样式集合。
  * cb `Function`
  更新且刷新后的回调。
* **说明**  
异步更新样式。如果节点还未被添加到Root上，则为同步，这种情况很罕见，会出现在parse()且未传入Dom参数的时候。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">text</div>
  </canvas>,
  '#selector'
);
root.ref.div.updateStyle({
  color: '#F00',
}, function() {
  console.log('updateStyle');
});
```
```jsx
let root = karas.parse(
  {
    tagName: 'svg',
    props: {},
    children: [123],
  }
);
root.updateStyle({
  color: '#F00',
});
root.appendTo('#selector');
```

#### updateFormatStyle
* **类型** `Function`
* **参数**
  * style `Object`
    更新的样式集合。
  * cb `Function`
    更新且刷新后的回调。
* **说明**  
异步更新格式化好的样式。它要求传入的样式key和value均是格式化的，以提升性能，并且不会覆盖静态样式，即只存在于currentStyle中。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">text</div>
  </canvas>,
  '#selector'
);
root.ref.div.updateFormatStyleNoOverwrite({
  [karas.enums.STYLE_KEY.COLOR]: [[255, 0, 0, 1], karas.style.unit.RGBA],
}, function() {
  console.log('updateStyle');
});
```

#### clearCache
* **类型** `Function`
* **参数**
  * onlyTotal `boolean`
    只清楚局部根节点。
* **说明**  
清除当前节点的缓存，以及向上查找清除所有缓存本节点的节点。在canvas的`cache`的渲染模式和webgl模式时，每个节点都尽可能缓存自己，一些特殊效果节点（如filter）还会生成局部根节点缓存（即以自己未根将所有子节点包括进来形成位图缓存）。在需要的时候可以用这个方法清除缓存重新生成。

#### remove
* **类型** `Function`
* **参数**
  * cb `Function`
    删除后的回调。
* **说明**  
异步删除本节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">text</div>
  </canvas>,
  '#selector'
);
root.ref.div.remove(function() {
  console.log('remove');
});
```

### html属性attribute

#### onXxx
* **类型** `Function`
* **说明**  
侦听Dom事件，on后面跟驼峰事件名。注意回调函数的this指向当前类。
* **示例**
```jsx
karas.render(
  <canvas>
    <div onClick={e => conosole.log('click', e)}>click</div>
  </canvas>,
  '#selector'
);
```

#### style
* **类型** `Object`
* **说明**  
css样式，jsx的inline写法。
* **示例**
```jsx
karas.render(
  <canvas>
    <div style={{ color: '#F00' }}>style</div>
  </canvas>,
  '#selector'
);
```

#### ref
* **类型** `String/Function`
* **说明**  
引用标识，可供局部根节点访问到。
* **示例**
```jsx
let div;
let root = karas.render(
  <canvas>
    <div ref="div">ref</div>
    <div ref={ref => div = ref}>ref</div>
  </canvas>,
  '#selector'
);
console.log(root.ref.div === div);
```

<a name="Dom"></a>
## Dom
* **类型** `class`
* **说明**  
VirtualDom的基类，所有非图形vd均是继承或实现了此类。一般情况下开发用不到。详见[虚拟Dom](#虚拟Dom)。

<a name="Root"></a>
## Root
* **类型** `class`
* **说明**  
[Dom](#Dom)的派生类，根节点canvas/svg/webgl实现了此类。一般情况下开发用不到。详见[根节点](#根节点)。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
console.log(root);
```

### html属性attribute

#### width
* **类型** `Number`
* **说明**  
根节点画布逻辑宽度。

#### height
* **类型** `Number`
* **说明**  
根节点画布逻辑高度。

#### noRender
* **类型** `boolean`
* **说明**  
是否不渲染，仅布局。此举在特殊场景下如仅测量节点大小时会用到。默认false。

#### contextAttributes
* **类型** `boolean`
* **说明**  
新建上下文参数。此举在getContext('2d')或getContext('webgl')时会传递给第2个参数。默认alpha/antialias/premultipliedAlpha/preserveDrawingBuffer为true。

### 类方法method

#### getTargetAtPoint
* **类型** `Function`
* **参数**
  * x `Number`
  * y `Number`
  * includeIgnore `Boolean` 是否包含display和pointerEvents为none的（即不可见不触发），默认否
* **说明**  
按z轴顺序返回最上层处于此x/y坐标的节点和path/zPath，path指从根节点开始到此节点的每层级children的索引数组，zPath则是zIndexChildren。
* **示例**
```jsx
let root = karas.render(
  <canvas width={360} height={360}>
    <div style={{width:100,height:100}}>
      <span>text</span>
    </div>
  </canvas>,
  '#selector'
);
console.log(root.getTargetAtPoint(10, 10)); // { target: span, path: [0, 0], zPath: [0, 0] }
```

<a name="Geom"></a>
## Geom
* **类型** `class`
* **说明**  
自定义矢量图形，目前内置的有`Circle`、`Ellipse`、`Line`、`Polygon`、`Polyline`、`Rect`、`Sector`几类基本图形。当需要更多的类型时，需继承此类并覆盖render()方法，实现代码复用。详见[自定义图形](#自定义图形)。
* **示例**
```jsx
class Custom extends karas.Geom {
  render(renderMode, lv, ctx, defs) {
    if(renderMode === karas.mode.CANVAS) {
      // canvas下绘制自定义图形
    }
    else if(renderMode === karas.mode.SVG) {
      // svg下绘制自定义图形
    }
    else if(renderMode === karas.mode.WEBGL) {
      // webgl下绘制自定义图形
    }
  }
}
// 需先注册自定义图形
karas.Geom.register('$custom', Custom);
karas.render(
  <$custom/>,
  '#selector'
);
```

### html属性attribute

#### mask
* **类型** `boolean` 只读
* **说明**  
  是否作为遮罩影响前面兄弟节点。

#### clip
* **类型** `boolean` 只读
* **说明**  
  是否作为反向遮罩影响前面兄弟节点。优先级比mask高。

### 类属性property

#### isMulti
* **类型** `boolean` 只读
* **说明**  
当前标签属性是否传入了`multi`，表明图形是多个形式，数量是传入属性的数组长度。当为真值时，所有图形的数据均扩展一个维度数组表示。
* **示例**
```jsx
karas.render(
  <canvas>
    <$line x1={0} x2={1} y1={0} y2={1} style={{width: 100, height: 100}}/>
    <$line x1={[0, 0.1]} x2={[1, 0.9]} y1={[0, 0.2]} y2={[1, 0.8]} style={{width: 100, height: 100}} multi={true}/>
  </canvas>,
  '#selector'
);
```

#### isMask
* **类型** `boolean` 只读
* **说明**  
当前标签属性是否传入了`mask`，表明图形是半透明遮罩。当为真值时，强制没有边线，因此只有封闭图形有效。它将作用于上一个相邻的兄弟[Xom](#Xom)节点，对[Text](#Text)不起作用。
* **示例**
```jsx
karas.render(
  <canvas>
    <div style={{width: 200, height: 200, background: '#F00'}}/>
    <$rect style={{width: 100, height: 100}} mask={true}/>
  </canvas>,
  '#selector'
);
```

#### isClip
* **类型** `boolean` 只读
* **说明**  
当前标签属性是否传入了`clip`，表明遮罩是裁剪性质。它和mask正好反过来，mask是只显示重合部分，clip是反之。
* **示例**
```jsx
karas.render(
  <canvas>
    <$rect style={{width: 100, height: 100}} clip={true}/>
  </canvas>,
  '#selector'
);
```

#### currentProps
* **类型** `Object` 只读
* **说明**  
当前标签属性副本，注意和`props`的区别。当有动画不断更改props某个属性时，并不会直接修改props原始值，而是反应在currentProps上。

### 类方法method

#### getProps
* **类型** `Function`
* **参数**
  * k `String`
    键值key。
* **说明**  
返回`currentProps`上的值，如果为空则返回`props`上的值，注意名字是加双下划线的。详见[自定义图形](#自定义图形)。

### 静态属性static

#### getRegister
* **类型** `Function`
* **参数**
  * name `String`
    返回已注册名字为name的矢量图形对象。
* **说明**  
任何矢量图形都需要先注册，内置的图形已经内置注册，如`$line`对应`Line`类。强制要求矢量图形以`$`开头，保持命名统一是良好的编程习惯。

#### register
* **类型** `Function`
* **参数**
  * name `String`
  * target `class`
    将要注册的矢量图形类。
* **说明**  
注册名字为name的矢量图形对象为target类。

#### hasRegister
* **类型** `Function`
* **参数**
  * name `String`
    返回名字为name是否已经被注册为矢量图形对象。
* **说明**  
注册前先检查是否已经被注册过。

#### delRegister
* **类型** `Function`
* **参数**
  * name `String`
    已经被注册为矢量图形对象的名称。
* **说明**  
删除注册过的图形对象，未注册什么也不发生。

## Img
<a name="Img"></a>
* **类型** `class`
* **说明**  
继承[Dom](#Dom)类，图片显示专用。

### 类属性property

#### isMask
* **类型** `boolean` 只读
* **说明** 当前标签属性是否传入了`mask`，表明位图是半透明遮罩。同[Geom](#Geom)。

#### isClip
* **类型** `boolean` 只读
* **说明**  
当前标签属性是否传入了`clip`，表明遮罩是裁剪性质。同[Geom](#Geom)。

### 静态属性

#### showError
* **类型** `boolean` 读写
* **说明**  
当图片加载失败时，是否显示默认的错误占位提示。默认true。

### html属性attribute

#### placeholder
* **类型** `String`
* **说明**  
当图片加载失败时，是否显示设置的占位图。占位图如果再次加载失败，则不展示。

#### src
* **类型** `String` 只读
* **说明**  
图片的url。

#### mask
* **类型** `boolean` 只读
* **说明**  
是否作为遮罩影响前面兄弟节点。

#### clip
* **类型** `boolean` 只读
* **说明**  
是否作为反向遮罩影响前面兄弟节点。优先级比mask高。

#### baseLine
* **类型** `number` 只读
* **说明**  
即高度。

### 类方法method

#### updateSrc
* **类型** `Function`
* **参数**
  * src `String`
    修改的新url。
  * handle `Function`
    修改完的回调。
* **说明**
异步修改图片的url。

<a name="Component"></a>
## Component
* **类型** `class`
* **说明**  
自定义组件，类似React的Component，逻辑和绘制的代码集合，可复用。详见[自定义组件](#自定义组件)。
* **示例**
```jsx
class Component extends karas.Component {
  render() {
    return <div>Hello Component!</div>;
  }
}
karas.render(
  <Component/>,
  '#selector'
);
```

<a name="自定义事件"></a>
## 自定义事件
除了Dom标准事件，自定义事件也很常用，最典型的例子是EventBus。实例化Event类或者继承Event类是普遍的做法，当继承Event类后，可使用其发送侦听注销事件的功能。

### 类方法method

#### on
* **类型** `Function`
* **参数**
  * id `String`
  侦听的事件id。
  * handle `Function`
  处理事件的回调。
* **说明**  
侦听`id`事件，当发生时触发`handle`回调处理。
* **示例**
```jsx
let event = new karas.Event();
event.on('event-id', function() {
  console.log('触发了事件');
});
event.emit('event-id');
```

#### once
* **类型** `Function`
* **参数**
  * id `String`
  侦听的事件id。
  * handle `Function`
  处理事件的回调。
* **说明**  
侦听`id`事件，当发生时仅触发一次`handle`回调处理。
* **示例**
```jsx
let event = new karas.Event();
event.once('event-id', function() {
  console.log('触发了事件');
});
event.emit('event-id');
event.emit('event-id'); // 第2次无效
```

#### off
* **类型** `Function`
* **参数**
  * id `String`
  取消侦听的事件id。
  * handle `Function`
  取消处理事件的回调。可选。
* **说明**  
取消侦听`id`事件的`handle`回调，未声明`handle`时取消全部。
* **示例**
```jsx
let event = new karas.Event();
event.once('event-id', function() {
  console.log('触发了事件');
});
event.off('event-id');
event.emit('event-id'); // 无效
```

#### emit
* **类型** `Function`
* **参数**
  * id `String`
  触发侦听的事件id。
  * ...data `*`
  触发事件的实参。可选多个。
* **说明**  
触发`id`事件的并附带任意多个数据。
* **示例**
```jsx
let event = new karas.Event();
event.once('event-id', function(a, b) {
  console.log('触发了事件', a, b);
});
event.emit('event-id', 'p1', 2);
```

### 静态属性static

#### mix
* **类型** `Function`
* **参数**
  * obj `Object`
  需要混入Event功能的对象。可选多个。
* **说明**  
当一个对象的类无法继承`Event`时，可选择混入实例对象的方式来达到同样的功能。值得注意的时会在对象上生成一个`__eHash`属性，以及上面所有的`Event`类方法。
* **示例**
```jsx
let obj = karas.Event.mix({});
obj.once('event-id', function() {
  console.log('触发了事件');
});
obj.emit('event-id');
```

#### REFRESH
* **类型** `String`
* **值** `refresh`
* **参数**
  * lv `Number`
    最大刷新等级。
* **说明**  
枚举变量，一般在侦听[Root](#Root)刷新时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>
);
root.on(karas.Event.REFRESH, function(lv) {
  console.log(lv); // 本次刷新中最大的lv
});
root.appendTo('#selector');
```

#### PAUSE
* **类型** `String`
* **值** `pause`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)暂停时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">pause</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.on(karas.Event.PAUSE, function() {
  console.log('pause');
});
a.pause();
```

#### PLAY
* **类型** `String`
* **值** `play`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)播放时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.on(karas.Event.PLAY, function() {
  console.log('play');
});
a.play(); // 手动调用play()可以省略，动画本身就是自动播放
```

#### FRAME
* **类型** `String`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)播放每帧时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">frame</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.on(karas.Event.FRAME, function() {
  console.log('frame'); // 每帧都会调用
});
```

#### FINISH
* **类型** `String`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)完成时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">pause</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.on(karas.Event.FINISH, function() {
  console.log('finish');
});
```

#### CANCEL
* **类型** `String`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)取消时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">cancel</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.on(karas.Event.CANCEL, function() {
  console.log('cancel');
});
a.cancel();
```

#### BEGIN
* **类型** `String`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)每轮开始时使用。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">begin</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
  iterations: 2,
});
a.on(karas.Event.BEGIN, function() {
  console.log('begin'); // 因为播放循环2次，所以有2轮开始。
});
```

#### END
* **类型** `String`
* **说明**  
枚举变量，一般在侦听[Animation](#Animation)动画末轮结束时使用，不包含endDelay时间。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">end</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
  iterations: 2,
});
a.on(karas.Event.END, function() {
  console.log('end'); // 因为播放循环2次，所以第2轮结束时才会触发。
});
```

<a name="虚拟Dom"></a>
## 虚拟Dom
同React一样，VirtualDom是个很重要的概念。不过karas中的虚拟Dom更加纯粹，因为React最终会映射到真实Dom中，但karas的canvas/svg/webgl根本就没有Dom（svg其实有，但和平常开发的概念不一样），VirtualDom是真的虚拟。另见基类[Xom](#Xom)。

### 类属性property

#### children
* **类型** `Array<Dom/Text/Geom>`
* **说明**  
此Dom下的直接孩子，可能是Dom/Text/Geom中的一种。

#### flowChildren
* **类型** `Array<Dom/Text/Geom>`
* **说明**  
此Dom下的直接孩子，且是文档流的孩子，即普通布局。

#### absChildren
* **类型** `Array<Dom/Text/Geom>`
* **说明**  
此Dom下的直接孩子，且是定位流的孩子，即绝对布局。

#### zIndexChildren
* **类型** `Array<Dom/Text/Geom>`
* **说明**  
此Dom下的直接孩子，且按照zIndex属性排好顺序。

#### lineGroups
* **类型** `Array<Dom/Text/Geom>`
* **说明**  
此Dom下的块元素组，一组可能是一个块元素，或者若干个没换行行内元素。

#### baseLine
* **类型** `Number`
* **说明**  
此Dom的baseLine，即最后一个lineGroups内容下Dom的baseLine。

#### key
* **类型** `Object`
* **说明**  
svg渲染模式下，DomDiff时唯一特殊对比标识，相同key的优先对比。一般配合在[自定义组件](#自定义组件)中使用，向相同真实Dom进行绘制时也会生效。
* **示例**
```jsx
karas.render(
  <svg>
    <div key="key">a</div>
  </svg>,
  '#selector'
);
karas.render(
  <svg>
    <div key="key">b</div>
  </svg>,
  '#selector'
);
```

### 类方法method

#### appendChild
* **类型** `Function`
* **参数**
  * target `Xom/Component`
  * cb `Function`
    回调。
* **说明**  
异步在children后添加节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas></canvas>,
  '#selector'
);
root.appendChild(<div>1</div>, function() {
  console.log('appendChild');
});
```

#### prependChild
* **类型** `Function`
* **参数**
  * target `Xom/Component`
  * cb `Function`
    回调。
* **说明**  
异步在children前添加节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas></canvas>,
  '#selector'
);
root.prependChild(<div>1</div>, function() {
  console.log('prependChild');
});
```

#### insertBefore
* **类型** `Function`
* **参数**
  * target `Xom/Component`
  * cb `Function`
    回调。
* **说明**  
异步在自身前添加节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div>1</div>
  </canvas>,
  '#selector'
);
root.children[0].insertBefore(<div>0</div>, function() {
  console.log('insertBefore');
});
```

#### insertAfter
* **类型** `Function`
* **参数**
  * target `Xom/Component`
  * cb `Function`
    回调。
* **说明**  
异步在自身后添加节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div>1</div>
  </canvas>,
  '#selector'
);
root.children[0].insertAfter(<div>2</div>, function() {
  console.log('insertAfter');
});
```

#### removeChild
* **类型** `Function`
* **参数**
  * target `Xom/Component`
  * cb `Function`
    回调。
* **说明**  
异步删除孩子节点，并刷新。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div>1</div>
  </canvas>,
  '#selector'
);
root.removeChild(root.children[0], function() {
  console.log('removeChild');
});
```

<a name="根节点"></a>
## 根节点
karas.render()方法渲染的根节点是个特殊虚拟Dom，它扩展了一些必要的功能。另见基类[Dom](#Dom)。

### 类属性property

#### dom
* **类型** `Dom` 只读
* **说明**  
根节点所对应的真实Dom节点，即appendTo()的节点。

#### renderMode
* **类型** `int` 只读
* **说明**  
当前根节点渲染类型。[karas.mode](#mode)的枚举值。

#### ctx
* **类型** `CanvasRenderingContext2D` 只读
* **说明**  
当渲染类型为canvas时，为canvas的2d上下文；当渲染类型为webgl时，为webgl的3d上下文。

#### defs
* **类型** `Object` 只读
* **说明**  
当渲染类型为svg时，特殊生成的对应svg功能中<defs/>的封装对象。一般开发用不到。

#### task
* **类型** `Object` 只读
* **说明**  
[Root](#Root)异步刷新时保存刷新回调的队列。一般开发用不到。

#### ref
* **类型** `Object` 只读
* **说明**  
同React一样，类似[Component](#Component)的ref功能。获取所包含的虚拟Dom对象引用时用到。

#### animateController
* **类型** `Object` 只读
* **说明**  
配合[karas.parse()](#parse)使用，全局动画控制器，对json中所有动画统一进行控制，方法同[Animation](#Animation)一样。
* **示例**
```jsx
let root = karas.parse(
  {
    "tagName": "canvas",
    "children": [
      {
        "tagName": "div",
        "children": ["a"],
        "animate": {
          "value": [
            {
              "translateX": 0
            },
            {
              "translateX": 100
            }
          ],
          "options": {
            "duration": 1000
          }
        }
      },
      {
        "tagName": "div",
        "children": ["a"],
        "animate": {
          "value": [
            {
              "translateY": 0
            },
            {
              "translateT": 100
            }
          ],
          "options": {
            "duration": 1000
          }
        }
      }
    ]
  }
);
root.animateController.pause(); // 上面2个div动画都会停止
```

### 类方法method

#### appendTo
* **类型** `Function`
* **参数**
  * dom `Dom/String`
  HTML节点或者SELECTOR选择器，真实DOM，karas将最终渲染在此dom对象上。如果是普通节点（如div）将在其下生成新的root节点（如canvas），如果是canvas/svg节点将直接利用。不存在或者root不匹配会报错。
* **说明**  
将根节点真实绘制到对应真实Dom中，karas.render()实际上是生成Root节点后，再调用这个方法。当出现一些想在真实绘制之前插入的操作时，可使用这种拆开的做法，比如侦听首次渲染。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>
);
root.appendTo('#selector');

// 等同于下方

karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
```
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>
);
root.on('refresh', function() {
  console.log('这里会输出首次渲染');
});
root.appendTo('#selector');

// 不等同于下方

karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
root.on('refresh', function() {
  console.log('这里不会输出首次渲染，因为已经渲染完了，除非首次渲染产生异步不可控情况');
});
```

#### scale
* **类型** `Function`
* **参数**
  * x `Number`
  高清方案下x缩放比例，影响事件响应坐标判断。可选，默认值1。
  * y `Number'
  高清方案下y缩放比例，影响事件响应坐标判断。可选，默认值等于x。
* **说明**  
当根节点的属性的width/height和样式的width/height不同时，需要设置缩放比例。canvas类似一张图片，属性的width/height是图片的真实尺寸，样式的width/height是最终渲染的尺寸。常见高清模式dpr为2时，样式尺寸设置为属性尺寸的一半，达到高清渲染的目的，此时scale要随之设置为2，等于dpr。  
`karas内部对DOM节点进行了自动判断，设置好了scale()，当需要手动调整时，才需要设置`
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
root.scale(2, 2);
```

#### addRefreshTask
* **类型** `Function`
* **参数**
  * cb `Function`
  异步刷新整个[Root](#Root)，完成后的回调。一般开发用不到。
* **说明**  
当特殊情况自定义更新但不触发整个Root刷新画布时，使用这个方法。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
root.addRefreshTask(function() {
  console.log('refresh');
});
```

#### addForceRefreshTask
* **类型** `Function`
* **参数**
  * cb `Function`
  强制异步刷新整个[Root](#Root)，完成后的回调。一般开发用不到。
* **说明**  
当特殊情况自定义更新但不触发整个Root刷新画布时，使用这个方法。强制无法撤回。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
root.addForceRefreshTask(function() {
  console.log('force refresh');
});
```

#### delRefreshTask
* **类型** `Function`
* **参数**
  * cb `Function`
  取消异步刷新整个[Root](#Root)的回调，找不到则无效。一般开发用不到。
* **说明**  
取消addRefreshTask()的功能。
* **示例**
```jsx
let root = karas.render(
  <canvas>Hello Root!</canvas>,
  '#selector'
);
function cb() {
  console.log('refresh'); // 被取消了不生效
}
root.addRefreshTask(cb);
root.delRefreshTask(cb);
```

#### resize
* **类型** `Function`
* **参数**
  * w `Number`
    新宽度。
  * h `Number`
    新高度。
  * cb `Function`
    刷新回调，参数为异步时间毫秒，-1是立即说明没发生变化。
* **说明**  
  重设根节点尺寸并刷新，注意不会修改Dom的css样式，需外部控制。
* **示例**
```jsx
let root = karas.render(
  <canvas width={360} height={360}>
    <div style={{width: '50%', height: '50%', background: '#F00'}}/>
  </canvas>,
  '#selector'
);
root.resize(720, 720, function(diff) {
  console.log(diff);
});
```

### html属性attribute

#### width/height
* **类型** `Number`
* **说明**  
定义画布的尺寸，类似于浏览器body的尺寸。必需。
* **示例**
```jsx
karas.render(
  <canvas width={100} height={100}>Hello karas!</canvas>,
  '#selector'
);
```

#### cache
* **类型** `boolean`
* **说明**  
是否开启缓存功能，仅canvas/webgl生效，提升性能。可选。
* **示例**
```jsx
karas.render(
  <canvas cache={true}>Hello karas!</canvas>,
  '#selector'
);
```

<a name="自定义图形"></a>
## 自定义图形
有时候，内置的矢量图形标签不够用或者不好用，需要继承[Geom](#Geom)来实现。比如要绘制一个田字格，虽然用`$polyline`标签也能做到，但语义表达和数据传入非常不方便，这时候可以自定义来实现。另见基类[Xom](#Xom)。
* **示例**
```jsx
class Grid extends karas.Geom {
  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    // display:none或者有缓存等特殊情况会标识break，此时无需再次绘制
    if(res.break) {
      return res;
    }
    // 基类方法会返回一些已经计算好的属性方便使用
    let {
      originX,
      originY,
      fill,
      stroke,
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      fillRule,
      dx,
      dy,
    } = res;
    let { width, height } = this;
    originX += dx;
    originY += dy;
    if(renderMode === karas.mode.CANVAS) {
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + width, originY);
      ctx.lineTo(originX + width, originY + height);
      ctx.lineTo(originX, originY + height);
      ctx.lineTo(originX, originY);
      ctx.moveTo(originX + width * 0.5, originY);
      ctx.lineTo(originX + width * 0.5, originY + height);
      ctx.moveTo(originX, originY + height * 0.5);
      ctx.lineTo(originX + width, originY + height * 0.5);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
if(!karas.Geom.hasRegister('$grid')) {
  karas.Geom.register('$grid', Grid);
}
karas.render(
  <canvas>
    <$grid style={{width: 100, height:100}}/>
  </canvas>,
  '#selector'
);
```
* **示例**
```jsx
class Custom extends karas.Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 注意双下划线同名约定
    this.__custom = props.custom;
  }

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    if(res.break) {
      return res;
    }
    // 使用getProps来获取custom，有变化时props上的custom是原始值不一定会变化，最新的在currentProps上
    let custom = this.getProps('custom');
  }
}
karas.Geom.register('$custom', Custom);
karas.render(
  <canvas>
    <$custom style={{ width: 100, height: 100 }} custom={{...someData}}/>
  </canvas>,
  '#selector'
);
```

<a name="自定义图形动画"></a>
## 自定义图形动画
当使用自定义图形时，这个矢量图会有绘制的数据在props上，像内置的`$circle`有r来表示半径一样。这些数据因为是自定义新增的，动画或更新时处理差值框架本身并不知晓，需要注册扩展实现。
* **示例**
```jsx
// 本例简单实现了一个自定义圆，半径从固定的10到20的动画过程。仅canvas。
class Yuan extends karas.Geom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__banjing = props.banjing;
  }
  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    let {
      cx,
      cy,
      fill,
    } = res;
    let { __cacheProps } = this;
    // 动画数据缓存在某个地方如__cacheProps，这样动画停止或结束后，别的地方引发刷新就会用这个缓存值
    if(__cacheProps.banjing === undefined) {
      __cacheProps.banjing = this.getProps('banjing');
    }
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.arc(cx, cy, __cacheProps.banjing, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
karas.Geom.register('$yuan', Yuan);
karas.refresh.change.addGeom('$yuan', 'banjing', {
  calDiff(p, n) {
    return n - p;
  },
  calIncrease(p, v, percent) {
    return p + v * percent;
  },
});
let root = karas.render(
  <canvas width="360" height="360">
    <$yuan ref="yuan" banjing={10} style={{
      width: 100,
      height: 100,
      fill: '#F00',
      background: '#000',
    }}/>
  </canvas>,
  '#selector'
);
root.ref.yuan.animate([
  {
    banjing: 10,
  },
  {
    banjing: 20,
  }
], {
  duration: 1000,
  fill: 'forwards',
});
```

<a name="自定义组件"></a>
## 自定义组件
同React一样，组件是在VirtualDom之上的一层封装，通过覆盖render()方法实现自定义输出渲染，通过调用setState()方法更新数据，从而完成视图的更新。另外为了贴合`Web Componet`，部分采用了`ShadowDom`的标准设计，详见[ShadowDom](#ShadowDom)。

### 类属性property

#### 代理实现
tagName、root、host、prev、next、parent、isDestroyed、x、y、width、height、clientWidth、clientHeight、offsetWidth、offsetHeight、outerWidth、outerHeight、style、animationList、currentStyle、computedStyle、currentProps、baseLine、bbox，同[Xom](#Xom)或[Dom](#Dom)或[Geom](#Geom)，均为代理。

<a name="shadow"></a>
#### shadow
* **类型** `Object` 只读
* **说明**  
组件的直接Dom子树的根节点，和[shadowRoot](#shadowRoot)不同，当组件的render()方法递归返回组件时，`shadow`指向返回的组件，`shadowRoot`则递归下去直到虚拟Dom。

<a name="shdaowRoot"></a>
#### shadowRoot
* **类型** `Object` 只读
* **说明**  
组件的真实Dom子树的根节点，和[shadow](#shadow)不同。

#### state
* **类型** `Object` 只读
* **说明**  
组件的state，和React一样。

#### host
* **类型** `Root/Component` 只读
* **说明**  
局部根节点，即ref所属的根节点。当组件a出现在另一个组件b内部时，a同时有ref，则可通过b.ref.a访问到a，a是属于b的。当组件a直接出现在Root下时，a属于Root。详见[Root](#Root)。

### 类方法method

#### 代理实现
animate、removeAnimate、clearAnimate、updateStyle，同[Xom](#Xom)或[Dom](#Dom)或[Geom](#Geom)，均为代理。

#### setState
* **类型** `Function`
* **参数**
  * newState `Object`
  混入老的state中的新数据。
  * cb `Function`
  执行并刷新后的回调。
* **说明**  
组件更新state，和React一样。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <Component ref="cp"/>
  </canvas>,
  '#selector'
);
root.ref.cp.setState({ a: 1 }, function() {
  console.log('setState finish');
});
```

### 静态属性

#### getRegister
* **类型** `Function`
* **参数**
  * name `String`
  返回已注册名字为name的组件。
* **说明**  
parse的json中首字母大写的tagName为组件，任何parse的组件都需要先注册。

#### register
* **类型** `Function`
* **参数**
  * name `String`
  * target `class`
    将要注册的组件类。
* **说明**  
注册名字为name的组件为target类。

#### hasRegister
* **类型** `Function`
* **参数**
  * name `String`
  返回名字为name是否已经被注册为组件。
* **说明**  
注册前先检查是否已经被注册过。

#### delRegister
* **类型** `Function`
* **参数**
  * name `String`
    已经被注册为组件的名称。
* **说明**  
删除注册过的组件，未注册什么也不发生。

### html属性attribute

#### onXxx/style/ref
* **说明**  
同[Xom](#Xom)。

#### on-xxx
* **类型** `Function`
* **说明**  
侦听自定义事件，on后面跟-再跟事件名。组件本身继承了[Event](#Event)，所以可以触发自定义事件。
* **示例**
```jsx
class Component extends karas.Component {
  componentDidMount() {
    this.emit('custom');
  }
  render() {
    return <div onClick={() => this.click}>inner</div>;
  }
}
karas.render(
  <canvas>
    <Component ref="cp" on-custom={() => console.log('custom')}/>
  </canvas>,
  '#selector'
);
```

<a name="工具集"></a>
## 工具集

### isObject
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个对象。

### isString
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个字符串。

### isFunction
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个函数。

### isNumber
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个数字。

### isBoolean
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个布尔值。

### isDate
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是一个日期。

### isNil
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是null或undefined。

### isPrimitive
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是原始值，即isNil、isBoolean、isString、isNumber。

### isAuto
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
返回target是否是null或undefined或字符串auto。

### stringify
* **类型** `Function`
* **参数**
  * target `*`
* **说明**  
如果target为null或undefined，返回空字符串，否则返回toString()表达。

### joinSourceArray
* **类型** `Function`
* **参数**
  * target `Array/*`
* **说明**  
如果target为Array，递归遍历每一项相加，且stringify()相连。如果是其它类型，直接调用stringify()。

### encodeHtml
* **类型** `Function`
* **参数**
  * s `String`
  需要格式化的字符串对象
  * isProps `boolean`
  是否是html属性
* **说明**  
编码双引号，当isProps为真时还包含尖括号、连字符。

### rgba2int
* **类型** `Function`
* **参数**
  * s `String`
  rgba值。
* **说明**  
将css格式的rgba颜色转换为一维4长度的int数组表达方式。

### int2rgba
* **类型** `Function`
* **参数**
  * s `Array<int>`
  rgba值。
* **说明**  
将一维4长度的int颜色数组转换为css格式的rgba表达方式。

### int2revert
* **类型** `Function`
* **参数**
  * s `Array<int>`
  rgba值。
* **说明**  
将一维4长度的int颜色数组转换为css格式的rgba表达方式，并反色。

### equalArr
* **类型** `Function`
* **参数**
  * a `Array<*>`
  * b `Array<*>`
* **说明**  
简化的对比Array的方式，数组中只有原始类型和引用类型，递归对比原始值和引用。

### equal
* **类型** `Function`
* **参数**
  * a `Array<*>`
  * b `Array<*>`
* **说明**  
深度对比对象。

### extend
* **类型** `Function`
* **参数**
  * target `Object`
  * source `Object`
  * keys `Array<String>` 可选
* **说明**  
按顺序继承source对象并生成新的target，当keys存在时只继承keys中的值。

### extend
* **类型** `Function`
* **参数**
  * target `Object`
  * source `Object`
  * keys `Array<String>` 可选
* **说明**  
按顺序继承source对象并生成新的target，当keys存在时只继承keys中的值。

<a name="注入"></a>
## 注入
在小程序、native等特殊环境下，一些必要的属性或方法和浏览器环境下不同，因此抽象出来这一部分作为可注入的实现。大部分是面向框架开发维护人员的，普通开发者无需关注。

### measureImg
* **类型** `Function`
* **参数**
  * url `String/Array<String>`
  * cb `Function`
* **说明**  
加载并测量图片信息，成功或失败后回调。
* **示例**
```jsx
karas.inject.measureImg('http://xxx', function(cache) {
  console.log(cache); // { success: boolean, width: Number, height: Number, url: String, source: <img> }
});
```

### IMG
* **类型** `Object`
* **说明**  
测量图片信息hash保存，key为url，value是`measureImg`中cache对象。

### INIT
* **类型** `int`
* **说明**  
测量图片信息状态枚举。

### LOADED
* **类型** `int`
* **说明**  
测量图片信息状态枚举。

### LOADING
* **类型** `int`
* **说明**  
测量图片信息状态枚举。

### isDom
* **类型** `Function`
* **参数**
  * target `Object`
* **说明**  
判断参数是否是个真实Dom节点。
* **示例**
```jsx
karas.inject.isDom(document.body); // true
```

### isWebGLTexture
* **类型** `Function`
* **参数**
  * target `Object`
* **说明**  
  判断参数是否是个WebGLTexture。
* **示例**
```jsx
karas.inject.isWebGLTexture(gl.createTexture()); // true
```

### checkSupportFontFamily
* **类型** `Function`
* **参数**
  * fontFamily `String`
* **说明**  
  判断字体是否被注册。
* **示例**
```jsx
karas.inject.checkSupportFontFamily('Arial');
```

### loadFont
* **类型** `Function`
* **参数**
  * fontFamily `String/Array<Object>`
  * url `String`
  * cb `Function`
* **说明**  
  加载并注册字体，可重载为加载一个字体列表。注册使用`document.fonts.add()`。
* **示例**
```jsx
karas.inject.loadFont('puhui', 'xxx', function() {});
// or
karas.inject.loadFont([{fontFamily: 'puhui', url: 'xxx'}], function() {});
```

### now
* **类型** `Function`
* **说明**  
返回当前时间，整型，优先`performance`，其次`Date`。
* **示例**
```jsx
karas.inject.now();
```

### requestAnimationFrame
* **类型** `Function`
* **参数**
  * cb `Function`
* **说明**  
下帧执行回调，返回执行id。
* **示例**
```jsx
karas.inject.requestAnimationFrame(function() {
  console.log('next');
});
```

### cancelAnimationFrame
* **类型** `Function`
* **参数**
  * cb `Function`
* **说明**  
取消下帧执行回调。
* **示例**
```jsx
let id = karas.inject.requestAnimationFrame(function() {
  console.log('next');
});
karas.inject.cancelAnimationFrame(id);
```

### getCacheCanvas
* **类型** `Function`
* **参数**
  * width `Number`
  * height `Number`
  * key `String`
* **说明**  
从缓存池中获取指定高宽的离屏canvas缓存，如果指定key，则为唯一实例，否则自动从缓存列表中存取。

### delCacheCanvas
* **类型** `Function`
* **参数**
  * key `String`
* **说明**  
删除离屏canvas缓存实例。

### releaseCacheCanvas
* **类型** `Function`
* **参数**
  * target `CANVAS`
* **说明**  
回收离屏canvas到缓存池中。

### hasCacheWebgl
* **类型** `Function`
* **参数**
  * key `String`
* **说明**  
缓存池中是否存在指定key的离屏canvas缓存。

### warn
* **类型** `Function`
* **参数**
  * s `String`
* **说明**  
内部的警告信息会调用，默认实现是`console.warn(s)`。

### error
* **类型** `Function`
* **参数**
  * s `String`
* **说明**  
内部的错误信息会调用，默认实现是`console.error(s)`。可以覆盖实现降级错误信息上报。

<a name="style包"></a>
## style包
包含`css`、`reset`、`unit`、`font`、`abbr`子对象。

### css
处理样式的工具集合。此举是面向框架开发维护人员的，普通开发者无需关注。

#### normalize
* **类型** `Function`
* **参数**
  * style `Object`
    更新的样式集合。
  * reset `Array<Object>`
    默认样式，可选。
* **说明**  
将传入的样式格式化为带单位的标准化格式，并使用枚举代替key。
* **示例**
```jsx
karas.style.css.normalize({
  margin: 0,
});
// { "6": [0, 1], "7": [0, 1], "8": [0, 1], "9": [0, 1] }
```

#### cloneStyle
* **类型** `Function`
* **参数**
  * style `Object`
    样式集合。
* **说明**  
将传入的样式clone。
* **示例**
```jsx
karas.style.css.cloneStyle({
  color: '#F00',
});
```

#### equalStyle
* **类型** `Function`
* **参数**
  * k `String/Number`
    对比的样式名，注意是格式化的枚举值。
  * styleA `Object`
    其中一个样式，注意是格式化的。
  * styleB `Array<Object>`
    另一个样式，注意是格式化的。
  * target `Xom`
    样式的对象，可选。因为矢量图形的props也存在于动画过程中，其不属于标准样式，所以需要特殊对待传入节点来标识。
* **说明**  
对比所属target的样式k，是否相等。
* **示例**
```jsx
karas.style.css.equalStyle(
  karas.enums.STYLE_KEY.COLOR,
  [[0, 0, 0, 1], karas.style.unit.RGBA],
  [[0, 0, 0, 1], karas.style.unit.RGBA],
);
// true
```

### reset
存储默认样式。

#### DOM
* **类型** `Object`
* **说明**  
普通Dom的样式hash枚举。

#### DOM_KEY_SET
* **类型** `Array<String>`
* **说明**  
普通Dom的样式键值列表。

#### DOM_ENTRY_SET
* **类型** `Array<Object>`
* **说明**  
普通Dom的样式键值对列表。

#### GEOM
* **类型** `Object`
* **说明**  
Geom矢量几何图形的样式hash枚举。

#### GEOM_KEY_SET
* **类型** `Array<String>`
* **说明**  
Geom矢量几何图形的样式键值列表。

#### GEOM_ENTRY_SET
* **类型** `Array<Object>`
* **说明**  
Geom矢量几何图形的样式键值对列表。

#### INHERIT
* **类型** `Object`
* **说明**  
普通Dom中默认继承的样式键值列表。

#### INHERIT_KEY_SET
* **类型** `Object`
* **说明**  
普通Dom中默认继承的样式hash枚举。

#### isValid
* **类型** `Function`
* **参数**
  * k `String`
  样式键值名
* **说明**  
检测样式名k是否合法是当前支持可用的。

### unit
单位枚举。包含：`AUTO`、`PX`、`PERCENT`、`NUMBER`、`INHERIT`、`DEG`、`STRING`、`RGBA`。

### font
定义字体相关的信息，目前只有arial一种。此举是面向框架开发维护人员的，普通开发者无需关注。

#### info
存储字体信息的hash，key是fontFamily。已有列表：https://github.com/karasjs/karas/blob/master/src/style/font.js#L3

#### register
* **类型** `Function`
* **参数**
  * fontFamily `String`
    注册的字体名。
  * url `String/ArrayBuffer`
    注册的字体路径或数据。
  * data `Object`
    字体信息，需包含`emSquare`、`ascent`、`descent`、`lineGap`（默认0）。
* **说明**  
  注册使用的新字体。此举可能会引发之前使用注册字体的自动刷新。
* **示例**
```jsx
karas.render(
  <canvas>
    <div style={{fontFamily:'newFont'}}>这里先使用默认字体显示，等下方注册加载成功后自动刷新。</div>
  </canvas>
);
karas.style.font.register('newFont', 'https://xxx', {
  emSquare: 2048,
  ascent: 1854,
  descent: 434,
  lineGap: 67,
});
```

#### support
* **类型** `Function`
* **参数**
  * fontFamily `String`
    字体名。
* **说明**  
  返回是否支持字体。
* **示例**
```jsx
karas.style.font.support('tahoma');
```

### abbr
将css样式简写变成拆开独立的样式，直接修改原对象。

#### toFull
* **类型** `Function`
* **参数**
  * style `Object`
    css样式集合。
  * k `String`
    需要拆开的样式名。
* **说明**  
  将css样式简写变成拆开独立的样式，直接修改原对象。
* **示例**
```jsx
karas.style.abbr.toFull({border:'1px solid #F00'}, 'border');
// {border: "1px solid #F00", borderTop: "1px solid #F00", borderRight: "1px solid #F00", borderBottom: "1px solid #F00", borderLeft: "1px solid #F00"}
```


<a name="parser包"></a>
## parser包
包含解析动态json的方法，和简写信息。

### parse
* **类型** `Function`
* **说明**  
实现karas.parse()的逻辑。此举是面向框架开发维护人员的，普通开发者无需关注。

### apply
* **类型** `Function`
* **参数**
  * json `JSON`
    JSON数据。
  * options `Object`
    可选参数。
* **说明**  
  karas.parse()的前置处理逻辑，将一个含library、vars的综合型json转换为普通的原始json数据并返回。
* **示例**
```jsx
let res = karas.parser.apply({
  library: [{
    id: 'a',
    tagName: 'span',
    props: {
      style: {
        color: '#F00',
      },
    },
    children: [123],
  }],
  tagName: 'div',
  props: {},
  children: [{
    libraryId: 'a',
  }],
});
// library、vars消失
console.log(res);
// 结果是下面
console.log({
  tagName: 'div',
  props: {},
  children: [{
    tagName: 'span',
    props: {
      style: {
        color: '#F00',
      },
    },
    children: [123],
  }],
});
```

### loadAndParse
详见[loadAndParse](#loadAndParse)。

### abbr
定义简写枚举、转换方法。此举是面向框架开发维护人员的，普通开发者无需关注。

<a name="animate包"></a>
## animate包
一系列处理动画相关的程序。

### Animation
详见[Animation](#Animation)。

### Controller
[Root](#Root)的animateController属性的类。此举是面向框架开发维护人员的，普通开发者无需关注。

### easing
贝塞尔曲线缓动计算方法，包含常见的缓动曲线类型，和自定义计算方法。

#### linear
* **类型** `Function`
* **参数**
  * percent `Number`
  [0, 1]区间的百分比进度。
* **说明**  
线性，等同于`bezier(1, 1, 0, 0)`。

#### easeIn
* **类型** `Function`
* **参数**
  * percent `Number`
  [0, 1]区间的百分比进度。
* **说明**  
缓入，等同于`bezier(0.42, 0, 1, 1)`。

#### easeOut
* **类型** `Function`
* **参数**
  * percent `Number`
  [0, 1]区间的百分比进度。
* **说明**  
缓出，等同于`bezier(0, 0, 0.58, 1)`。

#### ease
* **类型** `Function`
* **参数**
  * percent `Number`
  [0, 1]区间的百分比进度。
* **说明**  
缓入缓出，等同于`bezier(0.25, 0.1, 0.25, 1)`。

#### easeInOut
* **类型** `Function`
* **参数**
  * percent `Number`
  [0, 1]区间的百分比进度。
* **说明**  
缓入缓出，等同于`bezier(0.42, 0, 0.58, 1)`。

#### cubicBezier
* **类型** `Function`
* **参数**
  * x1 `Number`
  * y1 `Number`
  * x2 `Number`
  * y2 `Number`
  曲线控制点，x在[0, 1]区间，y不限。
* **说明**  
自定义缓动曲线生成，传入4个参数，返回一个缓动函数输入输出器。
* **示例**
```jsx
let easeInOut = karas.animate.easing.cubicBezier(0.42, 0, 0.58, 1);
easeInOut(0.5); // 返回0.0197224535483112
```

#### getEasing
* **类型** `Function`
* **参数**
  * v `Array/String`
* **说明**  
快捷综合的获取缓动曲线生成，可以传4个数值参数（此时等同cubicBezier方法），也可以传1个固定类型的string或css值。
* **示例**
```jsx
// 下面几种方法等价返回easeOut类型
karas.animate.easing.getEasing(0.42, 0, 0.58, 1);
karas.animate.easing.getEasing([0.42, 0, 0.58, 1]);
karas.animate.easing.getEasing('easeOut');
karas.animate.easing.getEasing('cubic-bezier(0.42, 0, 0.58, 1)');
```

### frame
帧动画工具。详见[frame](#frame)。

<a name="Animation"></a>
## Animation
[Xom](#Xom)执行动画后返回的对象，包含动画数据和控制方法。和`Web Animation Api`保存标准一致，用法相同。

### 类属性property

#### id
* **类型** `String` 只读
* **说明**  
返回动画的唯一id。

#### target
* **类型** `Xom` 只读
* **说明**  
返回动画的[Xom](#Xom)对象。

#### root
* **类型** `Root` 只读
* **说明**  
返回动画的`target`的[Root](#Root)对象。

#### keys
* **类型** `Array<String>` 只读
* **说明**  
返回动画的所有更改样式键值列表。

#### style
* **类型** `Object` 只读
* **说明**  
返回动画当前的样式。

#### list
* **类型** `Array<Object>` 只读
* **说明**  
返回动画的列表。

#### options
* **类型** `Object` 只读
* **说明**  
返回动画的参数。

#### duration
* **类型** `Number` 读写
* **说明**  
返回/设置动画的时长。

#### delay
* **类型** `Number` 读写
* **说明**  
返回/设置动画的开头延时。

#### endDelay
* **类型** `Number` 读写
* **说明**  
返回/设置动画的结尾延时。

#### iterations
* **类型** `int` 读写
* **说明**  
返回/设置动画的播放次数。

#### playbackRate
* **类型** `int` 读写
* **说明**  
返回/设置动画的播放速率，默认`1`。

#### fps
* **类型** `Number` 读写
* **说明**  
返回/设置动画的fps。默认`60`。

#### spf
* **类型** `Number` 只读
* **说明**  
返回动画的spf。

#### easing
* **类型** `String` 只读
* **说明**  
返回动画的贝塞尔缓动。

#### fill
* **类型** `String` 读写
* **说明**  
返回/设置动画的停留模式，有`none`、`forwards`、`backwards`、`both`。默认`none`。

#### direction
* **类型** `String` 读写
* **说明**  
返回/设置动画的方向，有`normal`、`reverse`、`alternate`、`alternate-reverse`。默认`normal`。

#### frames
* **类型** `Array<Object>` 只读
* **说明**  
返回动画的正向播放列表，格式化后的。

#### frames
* **类型** `Array<Object>` 只读
* **说明**  
返回动画的反向播放列表，格式化后的。

#### startTime
* **类型** `int` 只读
* **说明**  
返回动画的开始时间，毫秒级。

#### currentTime
* **类型** `int` 读写
* **说明**  
返回/设置动画的当前时间，毫秒级。

#### pending
* **类型** `boolean` 只读
* **说明**  
返回动画是否处在非播放状态。

#### finished
* **类型** `boolean` 只读
* **说明**  
返回动画是否处在结束状态。

#### playState
* **类型** `String` 只读
* **说明**  
返回动画的详细状态，有`idle`、`running`、`finished`。默认`idle`。

#### playCount
* **类型** `int` 读写
* **说明**  
返回/设置动画的播放次数。

#### isDestroyed
* **类型** `boolean` 只读
* **说明**  
返回动画是否已销毁。

#### animating
* **类型** `boolean` 只读
* **说明**  
返回动画是否处在播放状态，包含`fill`停留区段。

#### spfLimit
* **类型** `int` 只读
* **说明**  
返回/设置spf限制，不能超过此值为最大值。

#### assigning
* **类型** `boolean` 只读
* **说明**  
返回动画是否正在处于赋值给对象过程中，即每帧开始到刷新完成的这段时间。

### 类方法method

#### play
* **类型** `Function`
* **参数**
  * cb `Function`
  完成后回调。
* **说明**  
异步开始播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.play(); // 手动调用play()可以省略，动画本身就是自动播放
```

#### pause
* **类型** `Function`
* **参数**
  * cb `Function`
  完成后回调。
* **说明**  
异步暂停播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.pause();
```

#### resume
* **类型** `Function`
* **参数**
  * cb `Function`
  完成后回调。
* **说明**  
异步恢复播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.pause();
a.resume();
```

#### finish
* **类型** `Function`
* **参数**
  * cb `Function`
  完成后回调。
* **说明**  
异步结束播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.finish();
```

#### cancel
* **类型** `Function`
* **参数**
  * cb `Function`
  完成后回调。
* **说明**  
异步取消播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.cancel();
```

#### gotoAndPlay
* **类型** `Function`
* **参数**
  * v `Number`
  跳到的播放时间
  * options `Function`
    * isFrame `boolean`
    传入帧数来代替时间毫秒数
    * excludeDelay
    不包含delay时间
  * cb `Function`
  完成后回调。
* **说明**  
异步从某个时间点开始播放动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.gotoAndPlay(500);
```

#### gotoAndStop
* **类型** `Function`
* **参数**
  * v `Number`
  跳到的播放时间
  * options `Function`
    * isFrame `boolean`
    传入帧数来代替时间毫秒数
    * excludeDelay
    不包含delay时间
  * cb `Function`
  完成后回调。
* **说明**  
异步跳到某个时间点并暂停动画。
* **示例**
```jsx
let root = karas.render(
  <canvas>
    <div ref="div">play</div>
  </canvas>,
  '#selector'
);
let a = root.ref.div.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  },
], {
  duration: 1000,
});
a.gotoAndStop(500);
```

<a name="frame"></a>
## frame
帧动画基础工具集对象，总控。

### 属性property

#### task
* **类型** `Array<Function>`
当前帧动画侦听回调队列。

### 方法method

#### onFrame
* **类型** `Function`
* **参数**
  * handle `Function`
  侦听回调
* **说明**  
开始侦听帧动画，完成后执行回调。
* **示例**
```jsx
karas.animate.frame.onFrame(function() {
  console.log('每帧执行');
});
```

#### onFrame
* **类型** `Function`
* **参数**
  * handle `Function`
  侦听回调
* **说明**  
结束侦听帧动画。
* **示例**
```jsx
function handle() {
  console.log('每帧执行被取消');
}
karas.animate.frame.onFrame(handle);
karas.animate.frame.onFrame(handle);
```

#### nextFrame
* **类型** `Function`
* **参数**
  * handle `Function`
  侦听回调
* **说明**  
开始侦听帧动画，仅一帧，完成后执行回调。
* **示例**
```jsx
karas.animate.frame.nextFrame(function() {
  console.log('下帧执行');
});
```

#### pause
* **类型** `Function`
* **说明**  
全局暂停。
* **示例**
```jsx
karas.animate.frame.pause();
```

#### resume
* **类型** `Function`
* **说明**  
全局恢复暂停。
* **示例**
```jsx
karas.animate.frame.resume();
```

<a name="math包"></a>
## math包
数学工具集，包含`matrix`，`tar`，`geom`，`vector`，`booleanOperations`几种，分别处理矩阵、仿射变换、向量、空间几何。此举大多是面向框架开发维护人员的，普通开发者无需关注。

### matrix

#### identity
* **类型** `Function`
* **说明**
生成3阶单位矩阵，注意这是css的6位1维表达方式。

#### multiply
* **类型** `Function`
* **参数**
  * a `Array<Number>`
  * b `Array<Number>`
* **说明**
矩阵a乘以b，注意这是css的6位1维表达方式。

#### calPoint
* **类型** `Function`
* **参数**
  * point `Array<Number>`
  * matrix `Array<Number>`
* **说明**
根据matrix获取点point的换算后的坐标。
* **示例**
```jsx
karas.math.matrix.calPoint([0, 0], [1, 0, 0, 100, 100]); // [100, 100]
```

#### inverse
* **类型** `Function`
* **参数**
  * matrix `Array<Number>`
* **说明**
矩阵的逆矩阵，注意这是css的6位1维表达方式。

#### isE
* **类型** `Function`
* **参数**
  * matrix `Array<Number>`
* **说明**
矩阵是否为单位矩阵，注意这是css的6位1维表达方式。

### vector

#### dotProduct
* **类型** `Function`
* **参数**
  * x1 `Number`
  * y1 `Number`
  * x2 `Number`
  * y2 `Number`
* **说明**
向量点乘积。

#### crossProduct
* **类型** `Function`
* **参数**
  * x1 `Number`
  * y1 `Number`
  * x2 `Number`
  * y2 `Number`
* **说明**
向量叉乘积。
  
### geom

#### pointInPolygon
* **类型** `Function`
* **参数**
  * x `Number`
  * y `Number`
  * vertexes `Array<Number>`
* **说明**
x/y点是否在由一堆顶点vertexes组成的多边形中。

#### pointInQuadrilateral
* **类型** `Function`
* **参数**
  * x `Number`
  * y `Number`
  * x1 `Number`
  * y1 `Number`
  * x2 `Number`
  * y2 `Number`
  * x3 `Number`
  * y3 `Number`
  * x4 `Number`
  * y4 `Number`
  * matrix `Array<Number>`
* **说明**
  x/y点是否在一个矩形中（4个顶点），且矩形具有变换矩阵

#### angleBySide
* **类型** `Function`
* **参数**
  * a `Number`
  * b `Number`
  * c `Array<Number>`
* **说明**
余弦定理3边长求夹角。

#### bboxBezier
* **类型** `Function`
* **参数**
  * x0 `Number`
  * y0 `Number`
  * x1 `Number`
  * y1 `Number`
  * x2 `Number`
  * y2 `Number`
  * x3 `Number`
  * y3 `Number`
* **说明**
获取贝塞尔曲线所在的bbox矩形框，根据参数数量分为2阶和3阶。

#### bezierLength
* **类型** `Function`
* **参数**
  * points `Array<Number>`
    曲线的起始点、控制点、结束点。
  * order `Number`
    2阶还是3阶。
  * start `Number`
    开始，[0, 1]。
  * end `Number`
    结束，[0, 1]。
* **说明**
根据开始结束百分比获取贝塞尔曲线的长度，start和end不传默认为0和1即全部。

#### sliceBezier
* **类型** `Function`
* **参数**
  * points `Array<Number>`
    曲线的起始点、控制点、结束点。
  * t `Number`
    开始，[0, 1]。
* **说明**
根据开始百分比截取贝塞尔曲线的一部分。

#### sliceBezier2Both
* **类型** `Function`
* **参数**
  * points `Array<Number>`
    曲线的起始点、控制点、结束点。
  * start `Number`
    开始，[0, 1]。
  * end `Number`
    结束，[0, 1]。
* **说明**
根据开始结束百分比截取贝塞尔曲线的一部分。

### booleanOperations

#### union
* **类型** `Function`
* **参数**
  * a `Array<Number>`
  * b `Array<Number>`
* **说明**
合集。

#### subtract
* **类型** `Function`
* **参数**
  * a `Array<Number>` 多边形a
  * b `Array<Number>` 多边形b
  * intermediate `Boolean` 是否保留运算结果为中间数据格式，以便后续连续运算，默认false
* **说明**
减集。

#### subtractRev
* **类型** `Function`
* **参数**
  * a `Array<Number>` 多边形a
  * b `Array<Number>` 多边形b
  * intermediate `Boolean` 是否保留运算结果为中间数据格式，以便后续连续运算，默认false
* **说明**
反减集。

#### intersect
* **类型** `Function`
* **参数**
  * a `Array<Number>` 多边形a
  * b `Array<Number>` 多边形b
  * intermediate `Boolean` 是否保留运算结果为中间数据格式，以便后续连续运算，默认false
* **说明**
交集。

#### xor
* **类型** `Function`
* **参数**
  * a `Array<Number>` 多边形a
  * b `Array<Number>` 多边形b
  * intermediate `Boolean` 是否保留运算结果为中间数据格式，以便后续连续运算，默认false
* **说明**
异或集。

#### chain
* **类型** `Function`
* **参数**
  * a `Array<Number>` 多边形数据
* **说明**
格式化中间数据格式为最终顶点列表。

<a name="refresh包"></a>
## refresh包
刷新工具集，包含`level`，`change`、`Cache`，`Page`4个大类，分别处理刷新等级枚举、变更计算、缓存分页算法、渲染缓存逻辑。此举是面向框架开发维护人员的，普通开发者无需关注。

### level
* **说明**  
刷新等级插件开发可能会遇到，render()方法中的第2个参数
* **示例**
```jsx
const ENUM = {
  // 低位表示<repaint级别
  NONE: 0, //                                          0
  TRANSLATE_X: 1, //                                   1
  TRANSLATE_Y: 2, //                                  10
  TRANSLATE_Z: 4, //                                 100
  TRANSFORM: 8, //                                  1000
  TRANSFORM_ALL: 15, //                             1111
  OPACITY: 16, //                                  10000
  FILTER: 32, //                                  100000
  MIX_BLEND_MODE: 64, //                         1000000
  PERSPECTIVE: 128, //                          10000000

  REPAINT: 256, //                             100000000

  // 高位表示reflow
  REFLOW: 512, //                             1000000000

  // 特殊高位表示rebuild
  REBUILD: 1024, //                          10000000000
};
```

### change
* **说明**
计算刷新变化过程中的变化和等级，此举是面向框架开发维护人员的，普通开发者无需关注。当实现自定义图形时，需要用到它。

#### GEOM
* **说明**
存储geom矢量图形变化数据的hash表。

#### GEOM_KEY_SET
* **说明**
同上，所有key的集合。

#### isGeom
* **类型** `Function`
* **参数**
  * tagName `String`
  * k `String`
* **说明**  
判断一个k是否是指定矢量标签tagName下的属性。
* **示例**
```jsx
karas.refresh.change.isGeom('$circle', 'r'); // true
karas.refresh.change.isGeom('$circle', 'unknow'); // false
```

#### IGNORE
* **说明**
存储无变化数据的hash表。

#### REPAINT
* **说明**
存储`REPAINT`变化数据的hash表。
  
#### MEASURE
* **说明**
存储`MEASURE`变化数据的hash表。

#### isIgnore
* **类型** `Function`
* **参数**
  * k `String`
* **说明**  
判断一个k是否是无需刷新的`NONE`刷新等级。
* **示例**
```jsx
karas.refresh.change.isIgnore('pointerEvents'); // true
karas.refresh.change.isIgnore('visibility'); // false
```

#### isRepaint
* **类型** `Function`
* **参数**
  * k `String`
  * tagName `String` 可选，矢量标签的属性判断时需要。
* **说明**  
判断一个k是否是`REPAINT`刷新等级，否则是`REFLOW`。
* **示例**
```jsx
karas.refresh.change.isRepaint('color'); // true
karas.refresh.change.isRepaint('display'); // false
```

#### isMeasure
* **类型** `Function`
* **参数**
  * k `String`
* **说明**  
判断一个k是否是`MEASURE`刷新等级，说明需要测量文字。
* **示例**
```jsx
karas.refresh.change.isMeasure('fontFamily'); // true
karas.refresh.change.isRepaint('color'); // false
```

#### isValid
* **类型** `Function`
* **参数**
  * tagName `String`
  * k `String`
* **说明**  
判断一个k是否是有效的刷新。
* **示例**
```jsx
karas.refresh.change.isValid('$circle', 'r'); // true
karas.refresh.change.isValid('$circle', 'unknow'); // false
```

#### addGeom
* **类型** `Function`
* **参数**
  * tagName `String`
  * k `String/Array<String>`
  * options `Object`
* **说明**  
添加自定义图形的属性，这样这个属性在计算刷新时会被认为是有效的，如果options传入了`calDiff`和`calIncrease`，将被应用在计算差异的过程中，比如动画。详见[自定义图形动画](#自定义图形动画)。
* **示例**
```jsx
karas.refresh.change.addGeom('$new', 'newProps', {
  calDiff() {},
  calIncrease() {},
});
```

### Cache
* **说明**  
canvas的位图缓存功能实现，可以调整多少个节点进行一次局部聚类缓存。它相当于将一颗子树视为一个整体进行位图缓存。

#### NUM
* **类型** `Number` 读写
* **说明**  
读取/设置多少个节点进行局部缓存。默认5。
* **示例**
```jsx
karas.refresh.Cache.NUM = 5;
```

#### NA/LOCAL/CHILD/SELF
* **类型** `Number` 只读
* **说明**  
节点绘制render()方法中标示当前模式。NA为非缓存（svg渲染时），LOCAL为局部根节点（canvas/webgl当声明cacheAsBitmap时），CHILD为局部根节点的子节点，SELF为webgl模式特殊使用的每个节点位图缓存。
* **示例**
```jsx
karas.refresh.Cache.NUM = 5;
```

### Page
* **说明**  
canvas的位图缓存分页功能实现，若干个离屏canvas共用一份，类似内存管理。

#### CONFIG
* **类型** Object 读写
* **说明**  
读取/设置一个正方形尺寸和相对的数量。比如8和8，指8*8像素的正方形，一共8*8=64个放在一个离屏canvas上。注意浏览器有最大尺寸限制，以及大尺寸canvas性能会降低。默认见下面示例。
* **示例**
```jsx
karas.refresh.Page.CONFIG = {
  SIZE:   [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
  NUMBER: [8,  8,  8,  8,   8,   4,   2,    1,    1,    1],
};
```

<a name="ShadowDom"></a>
## ShadowDom
组件的实习部分采用了`ShadowDom`标准，即内部的Dom事件外部不感知，内部的css样式和外部隔离，除非手动指定。
* **示例**
```jsx
class Component extends karas.Component {
  click() {
    console.log('inner click');
  }
  render() {
    return <div onClick={() => this.click}>inner</div>;
  }
}
karas.render(
  <canvas>
    <div style={{color:'#F00'}} onClick={() => console.log('outer click')}>
      <Component/>
    </div>
  </canvas>,
  '#selector'
);
```
上述代码只会响应`inner click`，且文字是reset的黑色，不是红色。
如果想要外部注入组件内部事件或样式，需要组件自身同意，即props传参。css默认直接赋给组件即可。
* **示例**
```jsx
class Component extends karas.Component {
  click() {
    console.log('inner click');
  }
  render() {
    return <div onClick={() => this.click}>inner</div>;
  }
}
karas.render(
  <canvas>
    <div>
      <Component style={{color: '#F00'}}
                 onClick={() => console.log('outer click')}/>
    </div>
  </canvas>,
  '#selector'
);
```
上述代码`outer click`也会响应，且文字是红色。
