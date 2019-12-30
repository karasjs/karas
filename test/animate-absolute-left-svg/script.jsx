let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{position:'absolute'}}>123</span>
  </svg>,
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
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  let input = document.querySelector('input');
  input.value += '0';
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value += '1';
  input.value += JSON.stringify(o.virtualDom);
});
