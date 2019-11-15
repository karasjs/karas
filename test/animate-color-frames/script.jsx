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
});
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  n++;
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = n > 9 && n < 16;
});
