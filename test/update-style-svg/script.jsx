let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{color: '#F00'}}>1</div>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  color: '#00F'
}, function() {
  let input = document.querySelector('#base64');
  input.value = o.ref.div.computedStyle.color;
});
