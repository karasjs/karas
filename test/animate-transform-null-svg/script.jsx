let o = karas.render(
  <svg width="360" height="360">
    <div ref="t">123</div>
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
input.value = t.getComputedStyle().transform;
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().transform;
});
