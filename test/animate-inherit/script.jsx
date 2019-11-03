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
input.value = i.computedStyle.color;
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + i.computedStyle.color;
});
