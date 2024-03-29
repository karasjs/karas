let o = karas.render(
  <canvas width="360" height="360">
    <$circle ref="t" r="1" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    r: 1,
  },
  {
    r: 0,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on(karas.Event.FINISH, () => {
  input.value = t.r;
});
