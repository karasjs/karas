let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{fontSize:10}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {},
  {
    fontSize: 100,
    easing: 'cubic-bezier(1, 0, 1, 0)',
  },
  {}
], {
  duration: 200,
  fill: 'forwards',
  easing: 'cubic-bezier(0, 1, 0, 1)',
});
let input = document.querySelector('input');
input.value = animation.frames[0][karas.enums.FRAME_EASING] + '/' + animation.frames[1][karas.enums.FRAME_EASING];
