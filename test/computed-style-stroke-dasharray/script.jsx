let o = karas.render(
  <canvas width="360" height="360">
    <$line style={{width:100,height:100,strokeDasharray:'1 2'}} ref="t"/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let input = document.querySelector('input');
input.value = t.computedStyle.width + ',' + t.computedStyle.strokeDasharray;
