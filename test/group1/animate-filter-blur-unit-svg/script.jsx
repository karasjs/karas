let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{position:'absolute',left:0,top:0,background:'#F00'}}>1</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    filter: 'blur(0.1rem)',
  },
  {
    filter: 'blur(5)',
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
});
animation.on('finish', () => {
  input.value += '/' + t.getComputedStyle().filter;
});
