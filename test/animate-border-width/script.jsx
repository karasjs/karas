let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{borderLeft:'1px solid #000'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    borderLeftWidth: 1,
  },
  {
    borderLeftWidth: 10,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value = t.computedStyle.borderLeftWidth;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.computedStyle.borderLeftWidth;
});
