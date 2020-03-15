let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{background:'#F00'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    width: 100,
  },
  {
    width: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let animation2 = t.animate([
  {
    height: 100,
  },
  {
    height: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation2.on(karas.Event.FRAME, () => {
  if(n++ === 0) {
    input.value = t.computedStyle.width + ',' + t.computedStyle.height;
  }
});
animation2.on(karas.Event.FINISH, () => {
  input.value += '/' + t.computedStyle.width + ',' + t.computedStyle.height;
});
