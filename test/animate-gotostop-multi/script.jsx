let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{position:'absolute'}}>123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    top: 100,
    left: 100,
  },
  {
    top: 200,
    left: 300,
  }
], {
  duration: 100,
});
let animation2 = t.animate([
  {
    top: 200,
    left: 200,
  }
], {
  duration: 2,
  endDelay: 166.66666666666666,
});
let input = document.querySelector('input');
animation.gotoAndStop(10);
animation2.gotoAndStop(10, () => {
  input.value += t.computedStyle.left + ',' + t.computedStyle.top;
});
o.refreshTask();
