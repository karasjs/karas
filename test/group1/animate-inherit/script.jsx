let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t">
      <span ref="i">123</span>
    </div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let i = o.ref.i;
let animation = t.animate([
  {
    color: '#F00',
  },
  {
    color: '#00F',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value = i.getComputedStyle().color[0] < 255;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + i.getComputedStyle().color;
});
