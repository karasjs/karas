let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:100,height:100}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    background: 'linear-gradient(180deg, #F00 0%, #00F 99%, #FFF)',
  },
  {
    background: 'linear-gradient(90deg, #F00 0%, #00F 1%, #FFF)',
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
