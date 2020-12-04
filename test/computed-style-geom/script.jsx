let o = karas.render(
  <canvas width="360" height="360">
    <$line style={{width:100,height:100}} ref="t"/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.getComputedStyle().width + ',' + t.getComputedStyle().stroke;
