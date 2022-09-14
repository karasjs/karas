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
  if(++n > 1) {
    let now = t.getComputedStyle().color;
    if(last && now[0] === last[0] && now[1] === last[1] && now[2] === last[2] && now[3] === last[3]) {
      res = false;
    }
    last = now.slice(0);
  }
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = res;
});
