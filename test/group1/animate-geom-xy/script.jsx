let o = karas.render(
  <canvas width="360" height="360">
    <$line ref="t" xa="0" ya="0" xb="1" yb="1" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    xa: 0,
    ya: 0,
    xb: 1,
    yb: 1,
  },
  {
    xa: 0.8,
    ya: 0.2,
    xb: 0.2,
    yb: 0.8,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on(karas.Event.FINISH, () => {
  input.value = t.xa + ',' + t.ya + ',' + t.xb + ',' + t.yb;
});
