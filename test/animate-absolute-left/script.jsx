let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{position:'absolute'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    left: 0,
  },
  {
    left: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
input.value = t.computedStyle.left;
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.left;
});
