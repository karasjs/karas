let o = karas.render(
  <canvas width="360" height="360">
    <$polygon ref="t" points={[
      [0,0],
      [1,0],
      [1,1]
    ]} style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    points: [
      [0,0],
      [1,0],
      [1,1]
    ],
  },
  {
    points: [
      [0.5,0],
      [1,0],
      [1,0.5]
    ],
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value = t.points;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.points;
});
