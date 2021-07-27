let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 0
  },
  {
    translateX: 100
  }
], {
  duration: 200,
  fill: 'forwards',
});
let n = 0;
animation.on('finish', () => {
  let input = document.querySelector('input');
  input.value += '/' + n + ':' + t.getComputedStyle().translateX;
  if(n++ < 1) {
    animation.gotoAndPlay(0);
  }
});
