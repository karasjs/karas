class Yuan extends karas.Geom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__banjing = props.banjing;
  }
  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    let {
      cx,
      cy,
      fill,
    } = res;
    let { __cacheProps } = this;
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
let o = karas.render(
  <canvas width="360" height="360">
    <$yuan ref="yuan" banjing={10} style={{
      width: 100,
      height: 100,
      fill: '#F00',
      background: '#000',
    }}/>
  </canvas>,
  '#test'
);
o.ref.yuan.updateStyle({
  banjing: 20,
}, function() {
  var input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
