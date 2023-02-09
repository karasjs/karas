let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{width:200,height:200,backgroundImage:'url(../../image.png)'}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundPosition: '0 0',
  },
  {
    backgroundPosition: '20 30',
  }
], {
  duration: 100,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 1) {
    let backgroundPositionX = t.getComputedStyle().backgroundPositionX;
    let backgroundPositionY = t.getComputedStyle().backgroundPositionY;
    input.value = backgroundPositionX > 0 && backgroundPositionX < 20
      && backgroundPositionY > 0 && backgroundPositionY < 20;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().backgroundPositionX + ' ' + t.getComputedStyle().backgroundPositionY;
});
