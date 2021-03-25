let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#999'}} ref="middle">
      <span style={{display:'inlineBlock',padding:10,background:'#F00'}}>1</span>
      <span style={{display:'block',padding:10,background:'#0F0'}} ref="inner">2</span>
      <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>3</span>
    </div>
    <div>next</div>
  </svg>,
  '#test'
);
o.ref.inner.updateStyle({
  display: 'inlineBlock',
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
