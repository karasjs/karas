let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{position:'absolute'}}>123</span>
  </canvas>,
  '#test'
);
let input = document.querySelector('input');
let t = o.ref.t;
input.value += t.computedStyle.width;
let animation = t.animate([
  {
    width: 0,
  },
  {
    width: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
input.value += t.computedStyle.width;
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.width;
});
