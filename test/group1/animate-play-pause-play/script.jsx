let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t">123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    fontSize: 16,
  },
  {
    fontSize: 60,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value = t.getComputedStyle().fontSize > 16;
    animation.pause();
    animation.play(function() {
      input.value += '/play';
    });
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().fontSize + ',' + t.getComputedStyle().lineHeight;
});
