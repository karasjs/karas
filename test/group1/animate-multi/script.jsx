let o = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{display:'inlineBlock',background:'#F00'}}>123</span>
  </canvas>,
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

let o2 = karas.render(
  <canvas width="360" height="360">
    <span ref="t" style={{display:'inlineBlock',background:'#F00'}}>123</span>
  </canvas>,
  '#test2'
);
let t2 = o2.ref.t;
let animation2 = t2.animate([
  {
    height: 100,
  },
  {
    height: 200,
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation2.on(karas.Event.FINISH, () => {
  input.value = t.getComputedStyle().width + ',' + t2.getComputedStyle().height;
});
