let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:100,height:100,fill:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
  },
  {
    translateX: 200,
  }
], {
  duration: 1000,
  delay: 1000,
  fill: 'forwards',
});
animation.gotoAndStop(1200, () => {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
