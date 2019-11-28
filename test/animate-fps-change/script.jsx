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
  duration: 20000,
});
let n = 0;
let input = document.querySelector('input');
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  n++;
  animation.fps = 1;
  input.value = n > 2 ? 'false' : 'true';
});
