let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{
      width:100,
      height:100,
    }}/>
  </canvas>,
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
  easing: 'steps(3)',
});
let input = document.querySelector('input');
o.once('refresh', function() {
  input.value += '/' + t.getComputedStyle().backgroundColor;
});
