let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{display:'inlineBlock',background:'#F00',letterSpacing:10}}>abc</span>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
