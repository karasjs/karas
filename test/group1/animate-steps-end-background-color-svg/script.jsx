let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{
      width:100,
      height:100,
    }}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    background: '#F00',
  },
  {
    background: '#00F',
  }
], {
  duration: 200,
  easing: 'steps(3, end)',
});
let input = document.querySelector('input');
let n = 0;
o.on('refresh', function() {
  input.value += '/' + t.getComputedStyle().backgroundColor;
});
