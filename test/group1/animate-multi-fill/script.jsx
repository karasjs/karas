let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{background:'#F00'}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    width: 100,
  },
  {
    width: 200,
  }
], {
  duration: 200,
});
let animation2 = t.animate([
  {
    background: '#F00',
  },
  {
    background: '#00F',
  }
], {
  duration: 400,
});
let input = document.querySelector('input');
animation2.on(karas.Event.FINISH, () => {
  input.value = t.getComputedStyle().width + ',' + t.getComputedStyle().backgroundColor;
});
