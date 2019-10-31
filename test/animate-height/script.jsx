let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{background:'#F00'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    height: 100,
  },
  {
    height: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
input.value = t.computedStyle.height;
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.height;
});
