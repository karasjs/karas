let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{display:'inlineBlock'}}>123</span>
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
animation.play(function() {
  input.value += '/play';
});
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value += '/' + (t.getComputedStyle().width > 100);
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().width;
});
