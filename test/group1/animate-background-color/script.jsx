let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundColor: '#F00',
  },
  {
    backgroundColor: '#00F',
  }
], {
  duration: 100,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    let backgroundColor = t.getComputedStyle().backgroundColor;
    input.value = backgroundColor[0] < 255 && backgroundColor[0] > 0;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().backgroundColor;
});
