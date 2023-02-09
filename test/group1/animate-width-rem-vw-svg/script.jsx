let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:'1vw',height:20,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {},
  {
    width: '10rem',
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on(karas.Event.FINISH, () => {
  input.value = t.getComputedStyle().width;
});
