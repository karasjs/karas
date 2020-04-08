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
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.PLAY, function() {
  input.value += '/play0';
});
animation.play(function() {
  input.value += '/play1';
});
animation.play(function() {
  input.value += '/play2';
});
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value += '/' + t.computedStyle.color;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.computedStyle.color;
});
