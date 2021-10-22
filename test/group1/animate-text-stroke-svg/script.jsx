let o = karas.render(
  <svg width="360" height="360">
    <div ref="t">123</div>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
  },
  {
    textStroke:'#F00 2px'
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.gotoAndStop(100, function() {
  input.value = JSON.stringify(o.virtualDom);
});
