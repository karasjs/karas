let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
  </svg>,
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
  duration: 100,
  fill: 'forwards',
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
