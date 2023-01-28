let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{display:'none'}}>123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    display:'block'
  },
  {
    display:'block'
  }
], {
  duration: 200,
  delay: 200,
  fill: 'both',
});
let input = document.querySelector('input');
animation.gotoAndStop(100);
o.on('refresh', () => {
  input.value = t.getComputedStyle().display;
});
