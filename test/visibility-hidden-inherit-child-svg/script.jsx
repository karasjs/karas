let o = karas.render(
  <svg width="360" height="360">
    <div style={{visibility:'hidden'}}>1<span ref="span" style={{visibility:'visible'}}>2</span></div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom) + o.ref.span.getComputedStyle().visibility;
