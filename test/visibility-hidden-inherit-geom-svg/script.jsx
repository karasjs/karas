let o = karas.render(
  <svg width="360" height="360">
    <div style={{visibility:'hidden'}}>1<$line ref="line"/></div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom) + o.ref.line.getComputedStyle().visibility;
