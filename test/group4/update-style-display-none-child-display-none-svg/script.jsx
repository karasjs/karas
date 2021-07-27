let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{display:'none'}}>
      <span ref="span" style={{display:'none'}}>1</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.span.updateStyle({
  display: 'block',
}, function() {
  o.ref.div.updateStyle({
      display: 'block'
  }, function() {
    input.value = JSON.stringify(o.virtualDom);
  });
});
