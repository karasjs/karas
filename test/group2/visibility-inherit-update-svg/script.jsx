let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{visibility:'hidden'}}>1<span>2</span></div>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  visibility: 'visible',
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
