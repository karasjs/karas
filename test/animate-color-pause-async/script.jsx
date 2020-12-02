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
animation.on(karas.Event.FRAME, () => {
  animation.pause();
  n++;
  let input = document.querySelector('input');
  if(n === 1) {
    input.value = t.getComputedStyle().color;
  }
  else {
    input.value = 1;
  }
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = 2;
});
