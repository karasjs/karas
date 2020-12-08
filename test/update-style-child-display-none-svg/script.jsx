let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{display:'none'}}>
      <span ref="span">1</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.span.updateStyle({
  color: '#00F'
}, function() {
  input.value = JSON.stringify(o.virtualDom);
});
