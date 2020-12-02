let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().transform;
let animation = t.animate([
  {
    transform: 'translateX(10px)',
  },
  {
    transform: 'translateX(100px)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value += '/' + t.getComputedStyle().transform;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().transform;
});
