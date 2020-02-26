let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{fontSize:10}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    easing: 'cubic-bezier(0, 2, 0, 2)',
  },
  {
    fontSize: 20,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(t.computedStyle.fontSize > 20) {
    input.value = 'true';
  }
});
