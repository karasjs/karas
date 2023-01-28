let o = karas.render(
  <svg width="360" height="360">
    <div ref="t">123</div>
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
  input.value = JSON.stringify(t.currentStyle[karas.enums.STYLE_KEY.TRANSLATE_X]);
  let a = t.animate([
    {},
    {
      translateX: 200,
    }
  ], {
    duration: 100,
    fill: 'forwards',
  });
  a.on('begin', () => {
    input.value += '/' + t.currentStyle[karas.enums.STYLE_KEY.TRANSLATE_X] > 100;
  });
  t.removeAnimate(animation);
});
