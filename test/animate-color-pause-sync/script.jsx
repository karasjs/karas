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
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  let input = document.querySelector('input');
  input.value = 1;
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = 2;
});
animation.pause();
