let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t">123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().transform;
let animation = t.animate([
  {
    transform: 'matrix(1,0,0,1,10,20)',
  },
  {
    transform: 'matrix(1,0,0,1,50,60)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 1;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value += '/' + (t.getComputedStyle().transform[12] > 10);
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().transform;
});
