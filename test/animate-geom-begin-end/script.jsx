let o = karas.render(
  <canvas width="360" height="360">
    <$sector ref="t" begin="0" end="180" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    begin: 0,
    end: 180,
  },
  {
    begin: 90,
    end: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value = t.begin + ',' + t.end;
  }
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.begin + ',' + t.end;
});
