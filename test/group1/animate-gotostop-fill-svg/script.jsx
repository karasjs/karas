let o = karas.render(
  <svg width="360" height="360">
    <$rect ref="t" style={{width:100,height:100,fill:'linearGradient(#F00, #00F)'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    fill:'linearGradient(#F00, #00F)',
  },
  {
    fill:'linearGradient(#0F0, #00F)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.gotoAndStop(100, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(t.getComputedStyle().fill);
});
