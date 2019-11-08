let o = karas.render(
  <canvas width="360" height="360">
    <$line ref="t" x1="0" y1="0" x2="1" y2="1" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    controlA: [0.2, 0],
  },
  {
    controlA: [0.8, 0],
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 0) {
    input.value = t.controlA;
  }
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.controlA;
});
