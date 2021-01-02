let o = karas.render(
  <svg width="360" height="360">
    <$rect ref="t"
           style={{
             margin: 100,
             width: 100,
             height: 100,
             fill: ['#F00', 'linearGradient(rgba(255,0,0,0.5),rgba(0,0,255,0.5))'],
             stroke: ['#F00', '#00F'],
             strokeWidth: [4, 2],
           }}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    fill: ['#F00', 'linearGradient(rgba(255,0,0,0.5),rgba(0,0,255,0.5))'],
    stroke: ['#F00', '#00F'],
  },
  {
    fill: ['#00F', 'linearGradient(rgba(0,0,255,0.5),rgba(255,0,0,0.5))'],
    stroke: ['#00F', '#F00'],
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
input.value = JSON.stringify(t.getComputedStyle().fill) + '/' + JSON.stringify(t.getComputedStyle().stroke);
animation.on('finish', () => {
  input.value += '|' + JSON.stringify(t.getComputedStyle().fill) + '/' + JSON.stringify(t.getComputedStyle().stroke);
});
