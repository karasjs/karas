let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  }
], {
  duration: 100,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on('finish', () => {
  input.value = JSON.stringify(t.currentStyle.translateX);
  t.removeAnimate(animation);
  animation = t.animate([
    {},
    {
      translateX: 200,
    }
  ], {
    duration: 100,
    fill: 'forwards',
  });
  animation.on('begin', () => {
    input.value += '/' + JSON.stringify(t.currentStyle.translateX);
  });
});
