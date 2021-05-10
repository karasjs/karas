let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t">123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().transformOrigin;
let animation = t.animate([
  {
    transformOrigin: 'left top',
  },
  {
    transformOrigin: 'right bottom',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value += '/' + t.getComputedStyle().transformOrigin;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().transformOrigin;
});
