let o = karas.render(
  <svg width="360" height="360">
    <div ref="relative" style={{position:'relative'}}>relative</div>
    <div ref="block">block</div>
    <div ref="outer">
      <div ref="middle">
        <span ref="inner">inner</span>
      </div>
      <div ref="next1">next1</div>
    </div>
    <div ref="next2">next2</div>
  </svg>,
  '#test'
);

let relative = o.ref.relative;
let block = o.ref.block;
let outer = o.ref.outer;
let middle = o.ref.middle;
let inner = o.ref.inner;
let next1 = o.ref.next1;
let next2 = o.ref.next2;
let input = document.querySelector('#base64');

let rr = relative.render;
relative.render = function(renderMode, lv) {
  input.value += '/rr' + lv;
  rr.apply(relative, arguments);
};
let br = block.render;
block.render = function(renderMode, lv) {
  input.value += '/br' + lv;
  br.apply(block, arguments);
};
let or = outer.render;
outer.render = function(renderMode, lv) {
  input.value += '/or' + lv;
  or.apply(outer, arguments);
};
let mr = middle.render;
middle.render = function(renderMode, lv) {
  input.value += '/mr' + lv;
  mr.apply(middle, arguments);
};
let ir = inner.render;
inner.render = function(renderMode, lv) {
  input.value += '/ir' + lv;
  ir.apply(inner, arguments);
};
let n1r = next1.render;
next1.render = function(renderMode, lv) {
  input.value += '/n1r' + lv;
  n1r.apply(next1, arguments);
};
let n2r = next2.render;
next2.render = function(renderMode, lv) {
  input.value += '/n2r' + lv;
  n2r.apply(next2, arguments);
};

relative.updateStyle({
  left: 100,
});
block.updateStyle({
  padding: 10,
});
middle.updateStyle({
  padding: 30,
});
