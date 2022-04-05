let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:50,height:50,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    filter: 'saturate(100%)',
  },
  {
    filter: 'saturate(50%)',
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
    input.value = t.getComputedStyle().filter;
  }
  else if(n === 2) {
    input.value += '/' + (t.getComputedStyle().filter[0][1] < 100);
  }
});
animation.on('finish', () => {
  input.value += '/' + t.getComputedStyle().filter;
});
