let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{
      margin: 100,
      width: 100,
      height: 100,
      backgroundImage: ['url(../../image.png)'],
    }}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundImage: ['url(../../image.png)'],
  },
  {
    backgroundImage: ['url(../../logo.png)'],
  }
], {
  duration: 100,
  fill: 'forwards',
});
animation.on(karas.Event.FINISH, () => {
  o.on('refresh', function() {
    let input = document.querySelector('input');
    input.value = JSON.stringify(o.virtualDom);
  });
});
