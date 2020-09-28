let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'relative',padding:10,background:'#00F'}} ref="middle">
      <div style={{padding:10,background:'#0F0'}} ref="inner">123</div>
      <div style={{position:'absolute',left:100}}>next</div>
      <div>next2</div>
    </div>
  </svg>,
  '#test'
);
o.ref.inner.updateStyle({
  padding: 30,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
