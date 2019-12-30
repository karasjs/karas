let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{width:200,height:200,backgroundImage:'url(../image.png)'}}/>
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
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 0) {
    input.value += t.computedStyle.backgroundPositionX + ' ' + t.computedStyle.backgroundPositionY;
  }
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.backgroundPositionX + ' ' + t.computedStyle.backgroundPositionY;
});
