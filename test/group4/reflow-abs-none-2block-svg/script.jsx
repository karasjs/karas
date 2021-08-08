let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span style={{position:'absolute',display:'none'}} ref="span">1</span>
      <strong style={{position:'absolute',}}></strong>
    </div>
  </svg>,
  '#test'
);
o.ref.span.updateStyle({
  display: 'block',
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
