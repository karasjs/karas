let o = karas.render(
  <svg width="360" height="360">
    <$rect ref="t" style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    left: 0,
  },
  {
    left: 100,
  }
], {
  duration: 100,
  endDelay: 150,
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
