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
let last;
let res = true;
animation.on(karas.Event.FRAME, () => {
  let now = t.getComputedStyle().color;
  if(now === last) {
    res = false;
  }
  last = now;
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = res;
});
