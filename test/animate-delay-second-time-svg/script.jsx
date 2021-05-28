let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let a = t.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  }
], {
  duration: 1000,
  delay: 500,
  iterations: Infinity,
});
a.gotoAndStop(1600, function() {
  let input = document.querySelector('input');
  input.value = t.getComputedStyle('translateX').translateX;
});
