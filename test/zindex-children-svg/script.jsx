let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{background:'#F00',display:'none'}}>
      <span>123</span>
    </div>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  display: 'block',
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
