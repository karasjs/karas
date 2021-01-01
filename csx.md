# CSX
* 继承JSX
* 根元素必须是`canvas`或`svg`或`webgl`
* 矢量元素标签必须是`$`开头

# 支持DOM
* div
* p
* span
* strong
* b
* img

# 支持属性
* width `仅canvas/svg`
  * 0 默认
  * px
* height `仅canvas/svg`
  * 0 默认
  * px
* placeholder `仅img，图片加载失败时占位图`
  * null 默认
  * string

# 支持CSS
## 标准样式
* position
  * static 默认
  * absolute
  * relative
* display
  * block
  * inline 等同于inline-block
  * none
* top/right/bottom/left
  * auto 默认
  * px
  * %
* marginTop/marginRight/marginBottom/marginLeft `不会合并重叠margin`
  * auto 默认
  * px
  * %
* paddingTop/paddingRight/paddingBottom/paddingLeft
  * auto 默认
  * px
  * %
* width/height
  * auto 默认
  * px
  * %
* flexGrow
  * 0 默认
  * number
* flexShrink
  * 1 默认
  * number
* flexBasis
  * auto 默认
  * px
  * %
* flexDirection
  * row 默认
  * column
* justifyContent
  * flex-start 默认
  * flex-end
  * space-bewteen
  * space-around
  * center
* alignItems
  * stretch 默认
  * center
  * flex-start
  * flex-end
* alignSelf
  * auto 默认
  * stretch
  * center
  * flex-start
  * flex-end
* fontSize
  * inherit 默认，根元素为16px
  * px
* fontFamily
  * arial 默认
* fontStyle
  * inherit 默认，根元素为normal
  * oblique
  * italic
* fontWeight
  * inherit 默认，根元素为normal
  * bold
  * 100/200...
* color
  * inherit 默认，根元素为#000
* lineHeight
  * normal 默认
  * px
  * %
  * number
* textAlign
  * left 默认
  * right
  * center
* backgroundColor
  * transparent 默认
  * #rgb/rgb/rgba
* backgroundImage
  * none 默认
  * url() 图片
  * linear-gradient
    * 扩展支持linear-gradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radial-gradient
    * 扩展支持radial-gradient(cx cy ax ay ratio, color-stop)格式，其中c为圆心，a为长轴或半径，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
  * conic-gradient
* backgroundPositionX
  * 0 默认
  * px
  * %
  * contain/cover
* backgroundPositionY
  * 0 默认
  * px
  * %
  * contain/cover
* borderTopWidth/borderRightWidth/borderBottomWidth/borderLeftWidth
  * 0 默认
  * px
* borderTopColor/borderRightColor/borderBottomColor/borderLeftColor
  * \#000 默认
  * transparent
  * \#rgb/rgb/rgba
* borderTopStyle/borderRightStyle/borderBottomStyle/borderLeftpStyle
  * solid 默认
  * dashed
* borderTopLeftRadius/borderTopRightRadius/borderBottomRightRadius/borderBottomLeftRadius
  * 0 默认，仅影响背景色和图片
  * px
* transform
  * null 默认
  * translate/translateX/translateY
  * rotate/rotateZ
  * scale/scaleX/scaleY
  * skewX/skewY
  * matrix
* transformOrigin
  * center 默认
  * top
  * left
  * right
  * bottom
  * px
  * %
* visibility
  * inherit 默认
  * visible
  * hidden
* opacity
  * 1 默认
  * number
* zIndex
  * auto 默认
  * number
* boxShadow
  * null 默认
  * Array<Number>
* filter
  * null 默认
  * blur
* pointerEvents
  * inherit 默认
  * none
  * auto
* overflow
  * visible 默认
  * hidden
* mixBlendMode
  * normal 默认
  * multiply
  * screen
  * overlay
  * darken
  * lighten
  * colorDodge
  * colorBurn
  * hardLight
  * softLight
  * difference
  * exclusion
  * hue
  * saturation
  * color
  * luminosity
* fill
  * transparent 默认
  * #rgb/rgb/rgba
  * linear-gradient
    * 扩展支持linear-gradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radial-gradient
    * 扩展支持radial-gradient(cx cy ax ay ratio, color-stop)格式，其中c为圆心，a为长轴或半径，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
  * conic-gradient
* stroke
  * #000 默认
  * transparent
  * #rgb/rgb/rgba
  * linear-gradient
    * 扩展支持linear-gradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radial-gradient
    * 扩展支持radial-gradient(cx cy ax ay ratio, color-stop)格式，其中c为圆心，a为长轴或半径，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
  * conic-gradient
* strokeWidth
  * 1 默认
  * px
  * %
* strokeDasharray
  * null 默认
  * Array\<Number>
* strokeLinecap
  * butt 默认
  * round
  * square
* strokeLinejoin
  * miter 默认
  * round
  * bevel
* strokeMiterlimit
  * 4 默认
  * number
* fillRule
  * nonzero 默认
  * evenodd
## 扩展样式
`因动画场景需要，css的transform在多个时会出现后者覆盖前者的情况，因此将其所有变换单独拆解开来，且坐标系保持相对自身不互相干扰`
* translateX/translateY
  * 0 默认
  * px
  * %
* scaleX/scaleY
  * 1 默认
  * Number[0,∞)
* skewX/skewY
  * 0 默认
  * Deg[0,360]
* rotate/rotateZ
  * 0 默认
  * Deg[0,360]
## 简写
* font
* margin
* padding
* flex
* border
* background
* backgroundSize
* transform
* translate
* scale
* skew
# 矢量元素
## 内置列表
* $circle
* $ellipse
* $line
* $polygon
* $polyline
* $rect
* $sector
## 共有样式
* fill: Color
填充颜色
* stroke: Color
描边颜色
* stroke-width: Number
描边粗细
* stroke-dasharray: Array<Number>
描边虚线
* stroke-linecap: String
描边样式
* stroke-linejoin: String
描边转角
* stroke-miterlimit: Number
描边斜切比率
## 共有属性
* mask: Boolean
是否为遮罩，默认false。
* clip: Boolean
是否为裁剪性质的遮罩，默认false。
## 私有属性
### $circle
* r: Number
半径，相对于width百分比，取值[0, ∞)，默认1
### $ellipse
* rx: Number
x轴半径，相对于width百分比，取值[0, ∞)，默认1
* ry: Number
y轴半径，相对于height百分比，取值[0, ∞)，默认1
### $line
* x1: Number
开始点x坐标，相对于width百分比，取值(-∞, ∞)，默认0
* y1: Number
开始点y坐标，相对于height百分比，取值(-∞, ∞)，默认0
* x2: Number
结束点x坐标，相对于width百分比，取值(-∞, ∞)，默认1
* y2: Number
结束点y坐标，相对于height百分比，取值(-∞, ∞)，默认1
* controlA: Array\<Number>
第1个贝塞尔曲线控制点坐标[x, y]，相对于[width, height]百分比，取值(-∞, ∞)，默认null没有
* controlB: Array\<Number>
第2个贝塞尔曲线控制点坐标[x, y]，相对于[width, height]百分比，取值(-∞, ∞)，默认null没有
`当有1个控制点时曲线为贝塞尔二次曲线，有2个控制点时为贝塞尔三次曲线`
* start: Number
从百分比多少开始绘制，取值[0, 1]
* end: Number
到百分比多少结束绘制，取值[0, 1]
### $polygon
* points: Array\<Number>
组成多边形的每个点的坐标[x, y]，相对于[width, height]百分比，取值(-∞, ∞)，默认没有，至少3个点才够组成一个多边形
* controls: Array\<Number>
每2个点之间的贝塞尔曲线点，长度必须为2或者4，对应2阶或者3阶贝塞尔曲线，可以为空
### $polyline
* points: Array\<Number>
组成多条线段的每个点的坐标[x, y]，相对于[width, height]百分比，取值(-∞, ∞)，默认没有，至少2个点才够组成一条线段
* controls: Array\<Number>
每2个点之间的贝塞尔曲线点，长度必须为2或者4，对应2阶或者3阶贝塞尔曲线，可以为空。
* start: Number
从百分比多少开始绘制，取值[0, 1]
* end: Number
到百分比多少结束绘制，取值[0, 1]
### $rect
* rx: Number
圆角x轴半径，相对于width百分比，取值[0, ∞)，默认0
* ry: Number
圆角y轴半径，相对于height百分比，取值[0, ∞)，默认0
### $sector
* r: Number
半径，相对于width百分比，取值[0, ∞)，默认1
* begin: Number
起始角度，取值[0, 360]，默认0
* end: Number
结束角度，取值[0, 360]，默认0
* edge: Boolean
扇形非圆弧端是否需要描边，默认false
* closure: Boolean
是否直接相连扇形两侧闭合两个端点，而不是经过圆心，默认false

# 动态json格式
json和代码其实是一一对应的，二者完全等价，只是json可以动态加载，但无法用函数和编程。
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
json有压缩格式，即把常见的样式/动画的key简写别名，使得整体内容大小更短，但不易于阅读。
```ts
{
  tagName: string,
  props?: Object, // props即属性，常见style和矢量属性在其内。
  children?: Array<Object>,
  animate?: Object/Array<{ value: Object/Array, options: Object }>,
}
```
工具导出的json能看到`library`字段，这是编辑器专用，为了复用，所有的元件（可理解为一个dom类）均在library中，且有唯一`id`标识，json中使用`libraryId`来引用并实例化元件。实例化的json有`init`属性来覆盖`props`属性，相当于创建对象并传入初始化参数。
```ts
{
  tagName: 'canvas',
  children: [
    {
      libraryId: 0,
      init: {
        style: {
          background: '#F00'
        }
      },
    },
    {
      libraryId: 0,
      init: {
        style: {
          background: '#00F'
        }
      },
    }
  ],
  library: {
    id: 0,
    tagName: 'div',
    props: {
      style: {
        width: 100,
        height: 100
      }
    }
  }
}
```
工具导出的json还能看到`var-`开头的字段，会出现在`props`和`style`中，即插槽变量，在`karas.parse()`时可根据id传入变量替换对应的属性。另外想要替换某个特殊字段如`children`和`animate`，会看到特殊的如`var-children.0`的字段，数字标明索引。
```ts
let json = {
  tagName: 'canvas',
  children: [
    {
      libraryId: 0
    }
  ],
  library: {
    id: 0,
    tagName: 'div',
    props: {
      style: {
        background: '#F00',
        'var-background': {
          id: 'color',
          desc: '自定义背景色'
        }
      }
    },
    children: [],
    'var-children': {
      id: 'children',
      desc: '自定义children'
    }
  }
};
karas.parse(json, {
  vars: {
    color: '#00F',
    'children.0': 'text'
  }
});
```
