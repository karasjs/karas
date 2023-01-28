let o = karas.render(
  <svg width="360" height="360">
      <div ref="t" style={{
        background: '#F00',
      }}>123</div>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 100,
    offset: 0.5,
  },
  {
    translateX: 200,
    offset: 0.6,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    input.value = t.getComputedStyle().translateX < 100;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().translateX;
});
