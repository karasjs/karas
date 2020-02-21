let o = karas.render(
  <svg width="360" height="360">
    <$rect ref="t" style={{display:'none',width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    display: 'block',
  },
  {
    display: 'block',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
