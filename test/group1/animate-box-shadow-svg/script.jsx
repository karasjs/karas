let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{display:'inlineBlock'}}>123</span>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    boxShadow: '0 0 0 0 #F00',
  },
  {
    boxShadow: '1 1 1 1 #00F',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
