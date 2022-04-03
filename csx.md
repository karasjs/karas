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
* width `仅canvas/svg/webgl`
  * 0 默认
  * px
* height `仅canvas/svg/webgl`
  * 0 默认
  * px
* placeholder `仅img，图片加载失败时占位图`
  * undefined 默认
  * string

# 支持CSS
## 标准样式
* position
  * static 默认
  * absolute
  * relative
* display
  * block `简化强制开启bfc`
  * inline `渲染简化按dom序而非LineBox序`
  * inlineBlock
  * none
* top/right/bottom/left
  * auto 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* marginTop/marginRight/marginBottom/marginLeft
  * auto 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* paddingTop/paddingRight/paddingBottom/paddingLeft
  * auto 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* width/height
  * auto 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
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
  * rem
  * vw
  * vh
  * vmax
  * vmin
* flexWrap
  * nowrap 默认
  * wrap
  * wrapReverse
* alignContent
  * stretch 默认
  * flexStart
  * flexEnd
  * spaceBetween
  * spaceAround
  * center
* flexDirection
  * row 默认
  * rowReverse
  * column
  * columnReverse
* justifyContent
  * flexStart 默认
  * flexEnd
  * spaceBetween
  * spaceAround
  * center
* alignItems
  * stretch 默认
  * center
  * flexStart
  * flexEnd
  * baseline
* alignSelf
  * auto 默认
  * stretch
  * center
  * flexStart
  * flexEnd
  * baseline
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
  * * \#rgb/rgb/rgba
  * linearGradient
    * 扩展支持linearGradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radialGradient
    * 扩展支持radialGradient(cx cy ax ay tx ty ratio, color-stop)格式，其中c为开始圆心，a为长轴或半径，t为结束圆心默认同c，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
* textStrokeColor
  * inherit 默认，根元素为#000
  * * \#rgb/rgb/rgba
  * linearGradient
    * 扩展支持linearGradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radialGradient
    * 扩展支持radialGradient(cx cy ax ay tx ty ratio, color-stop)格式，其中c为开始圆心，a为长轴或半径，t为结束圆心默认同c，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
* textStrokeWidth
  * inherit 默认，根元素为0
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* textStrokeOver
  * inherit 默认，根元素为none
  * none
  * fill
* lineHeight
  * normal 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
  * number
* textAlign
  * left 默认
  * right
  * center
* letterSpacing
  * inherit 默认，根元素为0
  * px
* whiteSpace
  * inherit 默认， 根元素为breakAll
  * nowrap
  * breakAll
* textOverflow
  * clip 默认
  * ellipsis
* lineClamp
  * 0 默认，即无效
  * number 正整数，文本行数限制，超过则为省略号，且对所有块级节点生效
* backgroundColor
  * transparent 默认
  * \#rgb/rgb/rgba
* backgroundImage
  * none 默认，可以是数组形式设置多个
  * url() 图片
  * linearGradient
    * 扩展支持linearGradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限，color-stop为css格式
  * radialGradient
    * 扩展支持radialGradient(cx cy ax ay tx ty ratio, color-stop)格式，其中c为开始圆心，a为长轴或半径，t为结束圆心默认同c，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形，color-stop为css格式
  * conicGradient
* backgroundPositionX
  * 0 默认，可以是数组形式设置多个
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* backgroundPositionY
  * 0 默认，可以是数组形式设置多个
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
  * contain/cover
* backgroundRepeat
  * noRepeat 默认，可以是数组形式设置多个
  * repeatX
  * repeatY
* backgroundSize
  * auto 默认，可以是数组形式设置多个
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
  * contain/cover
* backgroundClip
  * borderBox 默认
  * paddingBox
  * contentBox
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
  * translate/translateX/translateY/translateZ
  * rotate/rotateX/rotateY/rotateZ
  * scale/scaleX/scaleY/scaleZ
  * skewX/skewY
  * rotate3d
  * matrix
  * perspective
* transformOrigin
  * center 默认
  * top
  * left
  * right
  * bottom
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* visibility
  * inherit 默认
  * visible
  * hidden
* opacity
  * 1 默认
  * number
* zIndex `简化每个元素都有自己独立的堆叠上下文，bg始终在底部`
  * auto 默认
  * number
* boxShadow
  * null 默认
  * Array<Number>
* filter
  * null 默认
  * blur
  * hue-rotate
  * saturate
  * brightness
  * grayscale
  * contrast
  * sepia
  * invert
  * drop-shadow
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
* perspective
  * 0 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* fill
  * transparent 默认，可以是数组形式设置多个
  * \#rgb/rgb/rgba
  * linearGradient
    * 扩展支持linearGradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radialGradient
    * 扩展支持radialGradient(cx cy ax ay tx ty ratio, color-stop)格式，其中c为开始圆心，a为长轴或半径，t为结束圆心默认同c，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
  * conicGradient
* stroke
  * \#000 默认，可以是数组形式设置多个
  * transparent
  * \#rgb/rgb/rgba
  * linearGradient
    * 扩展支持linearGradient(x1 y1 x2 y2, color-stop)格式，其中xy为起始点相对自身尺寸百分比坐标，范围[0,1]可超限
  * radialGradient
    * 扩展支持radialGradient(cx cy ax ay tx ty ratio, color-stop)格式，其中c为开始圆心，a为长轴或半径，t为结束圆心默认同c，相对自身尺寸百分比坐标，范围[0,1]可超限，ratio为短轴缩放比，默认1即圆形
  * conicGradient
* strokeWidth
  * 1 默认，可以是数组形式设置多个
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
* strokeDasharray
  * null 默认，可以是数组形式设置多个
  * Array\<Number>
* strokeLinecap
  * butt 默认，可以是数组形式设置多个
  * round
  * square
* strokeLinejoin
  * miter 默认，可以是数组形式设置多个
  * round
  * bevel
* strokeMiterlimit
  * 4 默认，可以是数组形式设置多个
  * number
* fillRule
  * nonzero 默认
  * evenodd
## 扩展样式
`因动画场景需要，css的transform在多个时会出现后者覆盖前者的情况，因此将其所有变换单独拆解开来，且坐标系保持相对世界不互相干扰`
* translateX/translateY
  * 0 默认
  * px
  * %
  * rem
  * vw
  * vh
  * vmax
  * vmin
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
* flexFlow
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
* strokeWidth: Number
描边粗细
* strokeDasharray: Array<Number>
描边虚线
* strokeLinecap: String
描边样式
* strokeLinejoin: String
描边转角
* strokeMiterlimit: Number
描边斜切比率
## 共有属性
* mask: Boolean
是否为遮罩，默认false。
* clip: Boolean
是否为裁剪性质的遮罩，默认false。
## 私有属性
### $circle
* r: Number
半径，相对于width百分比，取值~~[0, ∞)~~[0, 1]，默认1
### $ellipse
* rx: Number
x轴半径，相对于width百分比，取值~~[0, ∞)~~[0, 1]，默认1
* ry: Number
y轴半径，相对于height百分比，取值~~[0, ∞)~~[0, 1]，默认1
### $line
* x1: Number
开始点x坐标，相对于width百分比，取值~~(-∞, ∞)~~[0, 1]，默认0
* y1: Number
开始点y坐标，相对于height百分比，取值~~(-∞, ∞)~~[0, 1]，默认0
* x2: Number
结束点x坐标，相对于width百分比，取值~~(-∞, ∞)~~[0, 1]，默认1
* y2: Number
结束点y坐标，相对于height百分比，取值~~(-∞, ∞)~~[0, 1]，默认1
* controlA: Array\<Number>
第1个贝塞尔曲线控制点坐标[x, y]，相对于[width, height]百分比，取值~~(-∞, ∞)~~[0, 1]，默认null没有
* controlB: Array\<Number>
第2个贝塞尔曲线控制点坐标[x, y]，相对于[width, height]百分比，取值~~(-∞, ∞)~~[0, 1]，默认null没有
`当有1个控制点时曲线为贝塞尔二次曲线，有2个控制点时为贝塞尔三次曲线`
* start: Number
从百分比多少开始绘制，取值[0, 1]，可超限
* end: Number
到百分比多少结束绘制，取值[0, 1]，可超限
### $polygon
* points: Array\<Number>
组成多边形的每个点的坐标[x, y]，相对于[width, height]百分比，取值~~(-∞, ∞)~~[0, 1]，默认没有，至少3个点才够组成一个多边形
* controls: Array\<Number>
每2个点之间的贝塞尔曲线点，长度必须为2或者4，对应2阶或者3阶贝塞尔曲线，可以为空
* start: Number
从百分比多少开始绘制，取值[0, 1]，可超限
* end: Number
到百分比多少结束绘制，取值[0, 1]，可超限
* booleanOperations: Array\<String>
布尔运算，多个多边形之间两两运算的方式，从而形成新的图形。
### $polyline
* points: Array\<Number>
组成多条线段的每个点的坐标[x, y]，相对于[width, height]百分比，取值~~(-∞, ∞)~~[0, 1]，默认没有，至少2个点才够组成一条线段
* controls: Array\<Number>
每2个点之间的贝塞尔曲线点，长度必须为2或者4，对应2阶或者3阶贝塞尔曲线，可以为空。
* start: Number
从百分比多少开始绘制，取值[0, 1]，可超限
* end: Number
到百分比多少结束绘制，取值[0, 1]，可超限
### $rect
* rx: Number
圆角x轴半径，相对于width百分比，取值~~[0, ∞)~~[0, 1]，默认0
* ry: Number
圆角y轴半径，相对于height百分比，取值~~[0, ∞)~~[0, 1]，默认0
### $sector
* r: Number
半径，相对于width百分比，取值~~[0, ∞)~~[0, 1]，默认1
* begin: Number
起始角度，取值[0, 360]，默认0
* end: Number
结束角度，取值[0, 360]，默认0
* edge: Boolean
扇形非圆弧端是否需要描边，默认false
* closure: Boolean
是否直接相连扇形两侧闭合两个端点，而不是经过圆心，默认false
