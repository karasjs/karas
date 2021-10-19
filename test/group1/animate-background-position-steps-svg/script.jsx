let o = karas.render(
  <svg width="360" height="360">
    <div ref="t" style={{width:200,height:200,backgroundImage:'url(../../image.png)'}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    backgroundPosition: '0 0',
  },
  {
    backgroundPosition: '20 30',
  }
], {
  duration: 200,
  easing: 'steps(2)',
  direction: 'alternate',
  iterations: 3,
  fill: 'forwards',
});
let n = 0;
let input = document.querySelector('input');
animation.on('end', () => {
  if(n++ === 0) {
    input.value = t.getComputedStyle().backgroundPositionX + ' ' + t.getComputedStyle().backgroundPositionY;
  }
});
animation.on('finish', () => {
  input.value += '/' + t.getComputedStyle().backgroundPositionX + ' ' + t.getComputedStyle().backgroundPositionY;
});
