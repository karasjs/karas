let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{width:200,height:200,backgroundImage:'url(../../image.png)'}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundSize: '10px 20px',
  },
  {
    backgroundSize: '100px 200px',
  }
], {
  duration: 100,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    let backgroundSize = t.getComputedStyle().backgroundSize[0];
    input.value = backgroundSize[0] > 10 && backgroundSize[0] < 100;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().backgroundSize[0];
});
