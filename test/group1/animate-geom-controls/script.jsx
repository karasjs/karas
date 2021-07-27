let o = karas.render(
  <canvas width="360" height="360">
    <$polyline ref="t" points={[
      [0,0],
      [1,0],
      [1,1]
    ]} controls={[
      [0, 0.2],
      [0.8, 1]
    ]} style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    controls: [
      [0, 0.2],
      [0.8, 1]
    ],
  },
  {
    controls: [
      [0, 0.3],
      [0.7, 1]
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
    input.value = t.controls;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.controls;
});
