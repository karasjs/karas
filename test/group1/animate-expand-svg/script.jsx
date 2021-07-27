let o = karas.render(
  <svg width="360" height="360">
    <$rect ref="t" style={{width:100,height:100}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
