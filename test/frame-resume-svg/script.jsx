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
  duration: 200,
  fill: 'forwards',
});
karas.animate.frame.pause();
karas.animate.frame.resume();
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
