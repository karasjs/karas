let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
  },
  {
    borderRadius: 10,
  }
], {
  duration: 100,
  fill: 'forwards',
});
let n = 0;
let input = document.querySelector('input');
animation.on('frame', () => {
  if(n++ === 1) {
    input.value = t.getComputedStyle().borderTopLeftRadius[0] >= 0;
  }
});
animation.on('finish', () => {
  input.value += '/' + t.getComputedStyle().borderTopLeftRadius;
});
