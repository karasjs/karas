let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    background: 'radial-gradient(#F00 0%, #00F 99%, #FFF)',
  },
  {
    background: 'radial-gradient(#F00 0%, #00F 1%, #FFF)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 0) {
    input.value = t.computedStyle.backgroundImage;
  }
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  input.value += '/' + t.computedStyle.backgroundImage;
});
