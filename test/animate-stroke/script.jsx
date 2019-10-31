let o = karas.render(
  <canvas width="360" height="360">
    <$rect ref="t" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    stroke: '#F00',
  },
  {
    stroke: '#00F',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
input.value = t.computedStyle.stroke;
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.stroke;
});
