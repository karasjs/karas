let o = karas.render(
  <canvas width="360" height="360">
    <$rect ref="t" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 10,
  },
  {
    translateX: 100,
  }
], {
  duration: 200,
  delay: 100,
  fill: 'forwards',
  iterations: 2,
});
let input = document.querySelector('input');
let n = 0;
animation.on('frame', () => {
  if(n++ === 0) {
    input.value += '/' + t.currentStyle[karas.enums.STYLE_KEY.TRANSLATE_X].v;
  }
});
animation.on('begin', () => {
  input.value += '/' + (t.currentStyle[karas.enums.STYLE_KEY.TRANSLATE_X].v < 100);
});
