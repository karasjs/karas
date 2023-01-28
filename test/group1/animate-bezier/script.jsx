let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{fontSize:10}}>123</span>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    easing: 'cubic-bezier(0, 1, 0, 1)',
  },
  {
    fontSize: 100,
  }
], {
  duration: 400,
  fill: 'forwards',
});
let input = document.querySelector('input');
let n = 0;
animation.on(karas.Event.FRAME, () => {
  if(n === 2) {
    input.value = t.getComputedStyle().fontSize > 50;
  }
  n++;
});
animation.on(karas.Event.FINISH, () => {
  input.value += '/' + t.getComputedStyle().fontSize;
});
