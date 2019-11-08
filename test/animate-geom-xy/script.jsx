let o = karas.render(
  <canvas width="360" height="360">
    <$line ref="t" x1="0" y1="0" x2="1" y2="1" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: 1,
  },
  {
    x1: 0.8,
    y1: 0.2,
    x2: 0.2,
    y2: 0.8,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 0) {
    input.value = t.x1 + ',' + t.y1 + ',' + t.x2 + ',' + t.y2;
  }
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.x1 + ',' + t.y1 + ',' + t.x2 + ',' + t.y2;
});
