let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{position:'relative'}}>123</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    top: 0,
  },
  {
    top: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
