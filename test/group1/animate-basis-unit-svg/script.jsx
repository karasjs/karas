let o = karas.render(
  <svg width="360" height="360" style={{display:'flex'}}>
    <span ref="t" style={{background:'#F00'}}>1</span>
    <span ref="t2" style={{background:'#00F'}}>2</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    flexBasis: 10,
  },
  {
    flexBasis: '10%',
  }
], {
  duration: 100,
  fill: 'forwards',
});
let t2 = o.ref.t2;
t2.animate([
  {
    flexBasis: '10%',
  },
  {
    flexBasis: 10,
  }
], {
  duration: 100,
  fill: 'forwards',
});
let n = 0;
let input = document.querySelector('input');
animation.on('frame', () => {
  if(n++ === 1) {
    let flexBasis = t.getComputedStyle().flexBasis;
    let flexBasis2 = t2.getComputedStyle().flexBasis;
    input.value = flexBasis > 10 && flexBasis < 36 && flexBasis2 < 36 && flexBasis2 > 10;
  }
});
animation.on('finish', () => {
  input.value += '/' + t.getComputedStyle().flexBasis + ',' + t2.getComputedStyle().flexBasis;
});
