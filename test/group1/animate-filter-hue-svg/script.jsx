let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:50,height:50,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    filter: 'hue-rotate(0)',
  },
  {
    filter: 'hue-rotate(30)',
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
