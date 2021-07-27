let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{background:'#F00',letterSpacing:10}}>abc哈哈哈</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    letterSpacing: 10,
  },
  {
    letterSpacing: 20,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on('finish', () => {
  input.value = t.getComputedStyle().letterSpacing;
});
