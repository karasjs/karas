let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{background:'#F00'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    width: 100,
  },
  {
    width: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
let last = 0;
let correct = true;
animation.on(karas.Event.FRAME, () => {
  let current = t.getComputedStyle().width;
  if(current > last) {}
  else {
    correct = false;
  }
  last = current;
});
animation.on(karas.Event.FINISH, () => {
  let current = t.getComputedStyle().width;
  if(current === last && current === 200) {
    input.value = 'true';
  }
});
