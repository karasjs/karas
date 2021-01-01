let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{
      margin: 100,
      width: 100,
      height: 100,
      backgroundImage: ['url(../image.png)'],
    }}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundImage: ['url(../image.png)'],
  },
  {
    backgroundImage: ['url(../image.png)'],
  }
], {
  duration: 200,
  fill: 'forwards',
});
animation.on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
