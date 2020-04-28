let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
  },
  {
    transform:'translateX(100)'
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
input.value = t.computedStyle.transform;
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.computedStyle.transform;
});
