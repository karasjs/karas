let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{position:'relative'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    top: 0,
  },
  {
    top: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value = t.getComputedStyle().top > 0;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().top;
});
