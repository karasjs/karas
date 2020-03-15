let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    color: '#F00',
  },
  {
    color: '#00F',
  }
], {
  duration: 200,
  delay: 10000,
});
let input = document.querySelector('input');
input.value = 0;
let n = 0;
animation.on(karas.Event.FRAME, (delta, isDelay) => {
  if(!isDelay) {
    input.value = ++n;
  }
});
