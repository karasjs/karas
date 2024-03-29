let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t">123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().transform;
let animation = t.animate([
  {
    transform: 'translateX(100px)',
  },
  {
    transform: 'translateY(100px)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.FINISH, () => {
  input.value = t.getComputedStyle().transform;
});
