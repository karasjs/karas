let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{position:'absolute',left:0,top:0,background:'#F00'}}>1</span>
    <span ref="t2" style={{position:'absolute',left:0,top:200,background:'#F00'}}>2</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    left: 10,
  },
  {
    left: '10%',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let t2 = o.ref.t2;
t2.animate([
  {
    left: '10%',
  },
  {
    left: 10,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 0;
let input = document.querySelector('input');
animation.on('frame', () => {
  n++;
  if(n === 1) {
    input.value = t.computedStyle.left + ',' + t2.computedStyle.left;
  }
});
animation.on('finish', () => {
  input.value += '/' + t.computedStyle.left + ',' + t2.computedStyle.left;
});
