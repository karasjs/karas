let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t" style={{display:'none'}}>123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    display:'block'
  },
  {
    display:'block'
  }
], {
  duration: 200,
  endDelay: 200,
  fill: 'both',
});
let input = document.querySelector('input');
animation.gotoAndStop(300);
animation.on(karas.Event.FRAME, () => {
  input.value += t.computedStyle.display;
});
