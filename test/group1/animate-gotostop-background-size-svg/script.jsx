let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:100,height:100,background:'url(../../image.png) noRepeat 0 0',backgroundSize:'100% 100%'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundSize:'100% 100%',
  },
  {
    backgroundSize:'50% 50%',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.gotoAndStop(100, () => {
  let input = document.querySelector('input');
  input.value = t.getComputedStyle().backgroundSize;
});
