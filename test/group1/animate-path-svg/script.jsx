let o = karas.render(
  <svg width="360" height="360">
    <div ref="t1" style={{position:'absolute',width:100,height:100,background:'#F00'}}/>
    <div ref="t2" style={{position:'absolute',width:100,height:100,background:'#0F0'}}/>
    <div ref="t3" style={{position:'absolute',width:100,height:100,background:'#00F'}}/>
  </svg>,
  '#test'
);
let t1 = o.ref.t1;
let a1 = t1.animate([
  {
    translatePath: [0, 0, 100, 100, 200, 0],
    translateX: 100,
  },
  {
    translateX: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let t2 = o.ref.t2;
let a2 = t2.animate([
  {
    translatePath: [0, 0, 100, 100, 200, 0],
    translateX: 100,
  },
  {
    translateX: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let t3 = o.ref.t3;
let a3 = t3.animate([
  {
    translatePath: [0, 0, 100, 100, 200, 0],
  },
  {
    translatePath: [50, 20, 100, 100],
  }
], {
  duration: 200,
  fill: 'forwards',
});
a1.gotoAndStop(100);
a2.gotoAndStop(200);
a3.gotoAndStop(200);
let input = document.querySelector('input');
o.once('refresh', () => {
  input.value = document.querySelector('svg').innerHTML;
});
