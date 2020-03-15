let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    visibility: 'visible',
  },
  {
    visibility: 'hidden',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value = t.computedStyle.visibility;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.computedStyle.visibility;
});
