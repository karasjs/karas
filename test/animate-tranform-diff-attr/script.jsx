let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.computedStyle.transform;
let animation = t.animate([
  {
    transform: 'translateX(100px)',
  },
  {
    transform: 'translateY(100px)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 0) {
    input.value += '/' + t.computedStyle.transform;
  }
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.transform;
});
