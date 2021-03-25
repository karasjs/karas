let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{display:'inlineBlock',width:100,height:100,background:'#F00'}}/>
  </svg>,
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
  fill: 'forwards',
});
animation.cancel();
let input = document.querySelector('input');
input.value = JSON.stringify(o.virtualDom);
animation.resume();
animation.on(karas.Event.FINISH, () => {
  input.value = JSON.stringify(o.virtualDom);
});
