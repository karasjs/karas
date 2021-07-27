let o = karas.render(
  <canvas width="360" height="360">
    <div ref="t">123</div>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().width + ',' + t.getComputedStyle().fill;
