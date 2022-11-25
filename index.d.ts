declare namespace karas {
  let version: string;

  enum mode {
    CANVAS,
    SVG,
    WEBGL,
  }

  class Event {
    on(id: string | [string], handle: Function): void

    off(id: string | [string], handle: Function): void

    once(id: string | [string], handle: Function): void

    emit(id: string | [string]): void

    static mix(...obj: [object]): void
  }

  class Node extends Event {
    get x(): number

    get y(): number

    get width(): number

    get height(): number

    get clientWidth(): number

    get clientHeight(): number

    get offsetWidth(): number

    get offsetHeight(): number

    get outerWidth(): number

    get outerHeight(): number

    get prev(): Xom | Component | null

    get next(): Xom | Component | null

    get parent(): Xom | null

    get domParent(): Dom | null

    get root(): Root | null

    get host(): Component | null

    get hostRoot(): Component | null

    get baseline(): number

    get verticalBaseline(): number

    get virtualDom(): object

    get isDestroyed(): boolean

    get isReplaced(): boolean
  }

  class Text extends Node {
    constructor(content: string);

    render(lv, ctx, dx: number, dy: number): void

    remove(cb: Function): void

    get content(): string
    set content(v: string)

    get textBoxes(): [object]

    get charWidth(): number

    get firstCharWidth(): number

    get textWidth(): number

    get currentStyle(): object

    get computedStyle(): object

    get cacheStyle(): object

    get bbox(): [number]

    get filterBbox(): [number]

    get isShadowRoot(): boolean

    get matrix(): [number]

    get matrixEvent(): [number]

    get perspectiveMatrix(): [number]

    get fitFontSize(): number
  }

  class Xom extends Node {
    constructor(tagName: string, props: object);

    render(lv, ctx, dx: number, dy: number): void

    calContent(currentStyle: object, computedStyle: object): boolean

    refresh(lv: number, cb: Function): void

    willResponseEvent(e: object, ignore: boolean): boolean

    clearCache(onlyTotal: boolean): void

    clearTopCache(): void

    updateStyle(style: object, cb: Function): void

    updateFormatStyle(style: object, cb: Function): void

    animate(list: [object], options: object): void

    removeAnimate(o: animate.Animation): void

    clearAnimate(): void

    frameAnimate(cb: Function): void

    removeFrameAnimate(cb: Function): void

    clearFrameAnimate(): void

    getComputedStyle(key: string | [string]): object

    getBoundingClientRect(includeBbox: boolean): {
      left: number,
      top: number,
      right: number,
      bottom: number,
      points: [number],
    }

    remove(cb: Function): void

    get tagName(): string

    get listener(): object

    get opacity(): number

    get currentStyle(): object

    get computedStyle(): object

    get cacheStyle(): object

    get bbox(): [number]

    get filterBbox(): [number]

    get isShadowRoot(): boolean

    get matrix(): [number]

    get matrixEvent(): [number]

    get perspectiveMatrix(): [number]

    get contentBoxList(): [object]

    get parentLineBox(): object

    get mask(): Xom | Component
    set mask(v: Xom | Component)

    get clip(): Xom | Component
    set clip(v: Xom | Component)

    get cacheAsBitmap(): boolean
    set cacheAsBitmap(v: boolean)

    get env(): {
      x: number,
      y: number,
      width: number,
      height: number,
      node: Dom,
    } | null
  }

  class Dom extends Xom {
    constructor(tagName: string, props: object, children: [Xom | Component])

    appendChild(target: Node | Component, cb: Function): void

    prependChild(target: Node | Component, cb: Function): void

    insertBefore(target: Node | Component, cb: Function): void

    insertAfter(target: Node | Component, cb: Function): void

    removeChild(target: Node | Component, cb: Function): void

    get children(): [Node | Component]

    get flowChildren(): [Node | Component]

    get absChildren(): [Node | Component]

    get zIndexChildren(): [Node | Component]
  }

  class Img extends Dom {
    constructor(tagName: string, props: object);

    updateSrc(v: string, cb: Function): void

    get src(): string
  }

  class Root extends Dom {
    constructor(tagName: string, props: object, children: [Node | Component])

    appendTo(dom: string | HTMLElement): void

    draw(isFirst: boolean): void

    destroy(): void

    scale(x: number, y: number): void

    resize(w: number, h: number, cb: Function): void

    getTargetAtPoint(x: number, y: number, includeIgnore: boolean): Node | Component | null

    get dom(): HTMLElement

    get uuid(): number

    get renderMode(): mode

    get ctx(): CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext

    get defs(): object

    get ref(): object

    get animateController(): animate.Animation
  }

  class Geom extends Xom {
    constructor(tagName: string, props: object);
  }

  class Component extends Event {
    constructor(props: object);
  }

  function render(root: Root, dom: string | Dom): Root

  function createElement(tagName: string, props: object, ...children: [Node | Component]): Xom | Component

  function parse(json: JSON, dom: string | Dom, options: object): Xom | Component

  function loadAndParse(json: JSON, dom: string | Dom, options: object): Xom | Component

  namespace util {
    function isObject(o: any): boolean

    function isString(o: any): boolean

    function isFunction(o: any): boolean

    function isNumber(o: any): boolean

    function isBoolean(o: any): boolean

    function isDate(o: any): boolean

    function isNil(o: any): boolean

    function isPrimitive(o: any): boolean

    function isAuto(o: any): boolean

    function isPlainObject(o: any): boolean

    function stringify(o: any): string

    function rgba2int(color: string | [number]): string

    function int2rgba(color: [number]): [number]

    function clone(o: any): any

    function equalArr(a: [any], b: [any]): boolean

    function equal(a: any, b: any): boolean

    function extend(o: any): any
  }

  namespace inject {
    function measureImg(url: string, cb: Function): void

    function requestAnimationFrame(cb: Function): void

    function cancelAnimationFrame(cb: Function): void

    function now(): number

    function isDom(o: any): boolean

    function isWebGLTexture(o: any): boolean

    let defaultFontFamily: string

    function checkSupportFontFamily(ff: string): boolean

    function loadFont(fontFamily: string, url: string, cb: Function): void

    function loadFont(url: string, cb: Function): void

    function loadFont(list: [{ fontFamily: string, url: string }], cb: Function): void

    function loadComponent(url: string, cb: Function): void

    function loadComponent(list: [string], cb: Function): void
  }

  namespace style {
    namespace abbr {
      function toFull(style: object, k: string): object
    }

    namespace reset {
      const DOM: object
      const GEOM: object
      const DOM_KEY_SET: [object]
      const GEOM_KEY_SET: [object]
      const DOM_ENTRY_SET: [object]
      const GEOM_ENTRY_SET: [object]
      const INHERIT: object
      const INHERIT_KEY_SET: [object]

      function isValid(i: string): boolean
    }

    enum unit {
      AUTO,
      PX,
      PERCENT,
      NUMBER,
      INHERIT,
      DEG,
      STRING,
      RGBA,
      REM,
      EM,
      VW,
      VH,
      VMAX,
      VMIN,
      GRADIENT,
    }

    namespace unit {
      function calUnit(): { v: number, u: unit }
    }

    namespace font {
      function support(ff: string): boolean

      function register(name: string, url: string, data: object): void

      function hasRegister(ff: string): boolean

      function hasLoaded(ff: string): boolean

      function onRegister(ff: string, node: Xom): void

      function offRegister(ff: string, node: Xom): void
    }

    namespace css {
    }
    namespace transform {
    }
  }

  namespace parser {
  }

  namespace animate {
    namespace frame {
      function onFrame(handle: Function): void

      function offFrame(handle: Function): void

      function nextFrame(handle: Function): void

      function pause(): void

      function resume(): void

      let task: [object]
    }

    namespace easing {
      function linear(): Function

      function easeIn(): Function

      function easeOut(): Function

      function ease(): Function

      function easeInOut(): Function

      function cubicBezier(): Function

      function getEasing(v: number | [number], v1: number, v2: number, v3: number): Function
    }

    class Animation {
      constructor(target: Xom, list: [object], options: object)

      play(cb: Function): void

      pause(cb: Function): void

      resume(cb: Function): void

      finish(cb: Function): void

      cancel(cb: Function): void

      gotoAndStop(v: number, options: object, cb: Function): void

      gotoAndPlay(v: number, options: object, cb: Function): void

      addControl(): void

      removeControl(): void

      get id(): number

      get target(): Xom

      get root(): Root

      get keys(): []

      get options(): object

      get duration(): number

      get delay(): number

      set delay(v: number)

      get endDelay(): number

      set endDelay(v: number)

      get fps(): number

      set fps(v: number)

      get spf(): number

      set spf(v: number)

      get iterations(): number

      set iterations(v: number)

      get playbackRate(): number

      set playbackRate(v: number)

      get currentTime(): number

      set currentTime(v: number)

      get startTime(): number

      get nextTime(): number

      set nextTime(v: number)

      get timestamp(): number

      get fill(): string

      set fill(v: string)

      get easing(): string

      set easing(v: string)

      get direction(): string

      set direction(v: string)

      get frames(): [object]

      get framesR(): [object]

      get pending(): boolean

      get finished(): boolean

      get playState(): string

      get playCount(): number

      get isDestroyed(): boolean

      get animating(): boolean

      get spfLimit(): number

      set spfLimit(v: number)
    }
  }

  namespace math {
    namespace bezier {
      function bboxBezier(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number]

      function bezierLength(points: [{ x: number, y: number }] | [[number, number]]): number

      function pointAtBezier(points: [{ x: number, y: number }] | [[number, number]], percent: number, maxIterations: number, eps: number): number

      function pointAtBezierWithLength(points: [{ x: number, y: number }] | [[number, number]], length: number, percent: number, maxIterations: number, eps: number): number

      function sliceBezier(points: [{ x: number, y: number }] | [[number, number]], t: number): [[number, number]]

      function sliceBezier2Both(points: [{ x: number, y: number }] | [[number, number]], start: number, end: number): [[number, number]]

      function pointAtByT(points: [{ x: number, y: number }] | [[number, number]], t: number): [number, number]

      function getPointT(points: [{ x: number, y: number }] | [[number, number]], x: number, y: number): number

      function bezierSlope(points: [{ x: number, y: number }] | [[number, number]], t: number): number
    }

    namespace blur {
      function kernelSize(sigma: number): number

      function outerSize(sigma: number): number

      function outerSizeByD(d: number): number

      function gaussianWeight(sigma: number, d: number): number
    }

    namespace equation {
      function getRoots(coefs: [number]): [number]
    }

    namespace geom {
      function pointInConvexPolygon(x: number, y: number, vertexes: [[number, number]]): boolean

      function pointInQuadrilateral(x: number, y: number, x1: number, y1: number, x2: number, y2: number, x4: number, y4: number, x3: number, y3: number, matrix: [number]): boolean

      function d2r(n: number): number

      function r2d(n: number): number

      function h(deg: number): number

      function angleBySide(a: number, b: number, c: number): number

      function sideByAngle(alpha: number, a: number, b: number): number

      function pointsDistance(x1: number, y1: number, x2: number, y2: number): number

      function triangleIncentre(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number

      function ellipsePoints(x: number, y: number, a: number, b: number)

      function sectorPoints(x: number, y: number, r: number, begin: number, end: number)

      function getRectsIntersection(a: [number], b: [number])

      function isRectsOverlap(a: [number], b: [number], includeIntersect: boolean)

      function isRectsInside(a: [number], b: [number], includeIntersect: boolean)

      function calCoordsInNode(x: number, y: number, node: Xom)

      function calPercentInNode(x: number, y: number, node: Xom)

      function pointOnCircle(x: number, y: number, r: number, deg: number)

      function getPlainNormalEquation(points: [{ x: number, y: number, z: number }]): { a: number, b: number, c: number, d: number }
    }

    namespace isec {
      function intersectBezier2Line(ax1: number, ay1: number, ax2: number, ay2: number, ax3: number, ay3: number, bx1: number, by1: number, bx2: number, by2: number): [{ x: number, y: number }]

      function intersectBezier3Line(ax1: number, ay1: number, ax2: number, ay2: number, ax3: number, ay3: number, ax4: number, ay4: number, bx1: number, by1: number, bx2: number, by2: number): [{ x: number, y: number }]

      function intersectBezier2Bezier2(ax1: number, ay1: number, ax2: number, ay2: number, ax3: number, ay3: number, bx1: number, by1: number, bx2: number, by2: number, bx3: number, by3: number): [{ x: number, y: number }]

      function intersectBezier3Bezier3(ax1: number, ay1: number, ax2: number, ay2: number, ax3: number, ay3: number, ax4: number, ay4: number, bx1: number, by1: number, bx2: number, by2: number, bx3: number, by3: number, bx4: number, by4: number): [{ x: number, y: number }]

      function intersectBezier2Bezier3(ax1: number, ay1: number, ax2: number, ay2: number, ax3: number, ay3: number, bx1: number, by1: number, bx2: number, by2: number, bx3: number, by3: number, bx4: number, by4: number): [{ x: number, y: number }]

      function intersectLineLine3(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number): [{ x: number, y: number }]

      function intersectPlanePlane(p1: { x: number, y: number, z: number }, p2: { x: number, y: number, z: number }, p3: { x: number, y: number, z: number }, p4: { x: number, y: number, z: number }, p5: { x: number, y: number, z: number }, p6: { x: number, y: number, z: number }): [{ x: number, y: number, z: number }, { x: number, y: number, z: number }] | null

      function pointOnLine3(p: { x: number, y: number, z: number }, p1: { x: number, y: number }, p2: { x: number, y: number, z: number }): boolean
    }

    namespace matrix {
      function identity(): [number]

      function multiply(a: [number], b: [number]): [number]

      function multiplyTfo(m: [number], x: number, y: number): [number]

      function tfoMultiply(x: number, y: number, m: [number]): [number]

      function multiplyTranslateX(m: [number], v: number): [number]

      function multiplyTranslateY(m: [number], v: number): [number]

      function multiplyTranslateZ(m: [number], v: number): [number]

      function multiplyRotateX(m: [number], v: number): [number]

      function multiplyRotateY(m: [number], v: number): [number]

      function multiplyRotateZ(m: [number], v: number): [number]

      function multiplySkewX(m: [number], v: number): [number]

      function multiplySkewY(m: [number], v: number): [number]

      function multiplyScaleX(m: [number], v: number): [number]

      function multiplyScaleY(m: [number], v: number): [number]

      function multiplyScaleZ(m: [number], v: number): [number]

      function multiplyPerspective(m: [number], v: number): [number]

      function calPoint(point: { x: number, y: number, z: number, w: number }, m: [number]): { x: number, y: number, z: number, w: number }

      function calRectPoint(xa: number, ya: number, xb: number, yb: number, m: [number]): [number]

      function point2d(point: { x: number, y: number, z: number, w: number }): { x: number, y: number, z: number, w: number }

      function inverse(m: [number]): [number]

      function isE(m: [number] | null): boolean

      function m2m6(m: [number]): [number]
    }

    namespace tar {
      function exchangeOrder(source, target)

      function isOverflow(source, target)

      function transform(source, target)
    }

    namespace vector {
      function dotProduct(x1: number, y1: number, x2: number, y2: number): number

      function dotProduct3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number

      function crossProduct(x1: number, y1: number, x2: number, y2: number): number

      function crossProduct3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number

      function unitize(x: number, y: number): { x: number, y: number }

      function unitize3(x: number, y: number, z: number): { x: number, y: number, z: number }

      function isParallel(x1: number, y1: number, x2: number, y2: number): boolean

      function isParallel3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean

      function isZero(x1: number, y1: number, x2: number, y2: number): boolean

      function isZero3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean

      function angle(x1: number, y1: number, x2: number, y2: number): number

      function angle3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number

      function length(x1: number, y1: number, x2: number, y2: number): number

      function length3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number

      function getPerpendicularVector3(x: number, y: number, z: number): { x: number, y: number }
    }
  }

  namespace refresh {
    enum level {
      NONE = 0,
      CACHE = 1,
      TRANSLATE_X = 2,
      TRANSLATE_Y = 4,
      TRANSLATE_Z = 8,
      TRANSLATE = 14,
      ROTATE_Z = 16,
      SCALE_X = 32,
      SCALE_Y = 64,
      SCALE_Z = 128,
      SCALE = 224,
      TRANSFORM = 256,
      TRANSFORM_ALL = 510,
      OPACITY = 512,
      FILTER = 1024,
      MIX_BLEND_MODE = 2048,
      PERSPECTIVE = 4096,
      MASK = 8192,
      REPAINT = 16384,
      REFLOW = 32768,
      REBUILD = 65536,
    }

    namespace level {
      function contain(lv: number, value: number): boolean

      function exclude(lv: number, value: number): boolean

      function getLevel(k: number): level

      function isReflow(lv: number): boolean

      function isRepaint(lv: number): boolean
    }

    namespace change {
      function addGeom(tagName: string, ks: [string], cb: Function): void

      function isIgnore(k: string): boolean

      function isGeom(tagName: string, k: string): boolean

      function isRepaint(k: string, tagName: string): boolean

      function isValid(tagName: string, k: string): boolean
    }

    class Page {
      constructor(renderMode: mode, ctx: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext, size: number, number: number)
    }

    class Cache {
      constructor(renderMode: mode, ctx: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext, w: number, h: number, bbox: [number], page: Page, pos: number, x1: number, y1: number)
    }

    namespace webgl {
      function initShaders(gl: WebGLRenderingContext | WebGL2RenderingContext, vShader: string, fShader: string)

      function drawTextureCache(gl: WebGLRenderingContext | WebGL2RenderingContext, list: [{ cache: Cache, opacity: number, matrix: [number] }], cx: number, cy: number, dx: number, dy: number)

      function createTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, tex: HTMLCanvasElement | HTMLImageElement | WebGLTexture, n: number, width: number, height: number)

      function bindTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, tex: HTMLCanvasElement | HTMLImageElement | WebGLTexture, n: number)
    }
  }

  namespace enums {
    enum STYLE_KEY {
      POSITION,
      DISPLAY,
      TOP,
      RIGHT,
      BOTTOM,
      LEFT,
      MARGIN_TOP,
      MARGIN_RIGHT,
      MARGIN_BOTTOM,
      MARGIN_LEFT,
      PADDING_TOP,
      PADDING_RIGHT,
      PADDING_BOTTOM,
      PADDING_LEFT,
      FONT_SIZE,
      FONT_FAMILY,
      COLOR,
      FONT_STYLE,
      FONT_WEIGHT,
      LINE_HEIGHT,
      BACKGROUND_IMAGE,
      BACKGROUND_COLOR,
      BACKGROUND_SIZE,
      BACKGROUND_REPEAT,
      BACKGROUND_POSITION_X,
      BACKGROUND_POSITION_Y,
      BORDER_TOP_WIDTH,
      BORDER_RIGHT_WIDTH,
      BORDER_BOTTOM_WIDTH,
      BORDER_LEFT_WIDTH,
      BORDER_TOP_COLOR,
      BORDER_RIGHT_COLOR,
      BORDER_BOTTOM_COLOR,
      BORDER_LEFT_COLOR,
      BORDER_TOP_STYLE,
      BORDER_RIGHT_STYLE,
      BORDER_BOTTOM_STYLE,
      BORDER_LEFT_STYLE,
      BORDER_TOP_LEFT_RADIUS,
      BORDER_TOP_RIGHT_RADIUS,
      BORDER_BOTTOM_RIGHT_RADIUS,
      BORDER_BOTTOM_LEFT_RADIUS,
      WIDTH,
      HEIGHT,
      FLEX_GROW,
      FLEX_SHRINK,
      FLEX_BASIS,
      FLEX_DIRECTION,
      JUSTIFY_CONTENT,
      ALIGN_ITEMS,
      ALIGN_SELF,
      TEXT_ALIGN,
      TRANSFORM_ORIGIN,
      VISIBILITY,
      OPACITY,
      Z_INDEX,
      TRANSFORM,
      TRANSLATE_X,
      TRANSLATE_Y,
      TRANSLATE_Z,
      SCALE_X,
      SCALE_Y,
      SCALE_Z,
      SKEW_X,
      SKEW_Y,
      ROTATE_X,
      ROTATE_Y,
      ROTATE_Z,
      ROTATE_3D,
      PERSPECTIVE,
      PERSPECTIVE_ORIGIN,
      FILTER,
      BOX_SHADOW,
      POINTER_EVENTS,
      OVERFLOW,
      MIX_BLEND_MODE,
      BACKGROUND_CLIP,
      WHITE_SPACE,
      TEXT_OVERFLOW,
      LETTER_SPACING,
      LINE_CLAMP,
      ORDER,
      FLEX_WRAP,
      ALIGN_CONTENT,
      TEXT_STROKE_WIDTH,
      TEXT_STROKE_COLOR,
      TEXT_STROKE_OVER,
      WRITING_MODE,
      TRANSFORM_STYLE,
      BACKFACE_VISIBILITY,
      BOX_SIZING,
      FONT_SIZE_SHRINK,
      // GEOM
      FILL,
      STROKE,
      STROKE_WIDTH,
      STROKE_DASHARRAY,
      STROKE_DASHARRAY_STR,
      STROKE_LINECAP,
      STROKE_LINEJOIN,
      STROKE_MITERLIMIT,
      FILL_RULE,
      // 无此样式，仅cache或特殊情况需要
      MATRIX,
      BORDER_TOP,
      BORDER_RIGHT,
      BORDER_BOTTOM,
      BORDER_LEFT,
      TRANSLATE_PATH,
    }
  }

  let debug: boolean;
}
