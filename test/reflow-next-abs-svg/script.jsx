let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'relative',padding:10,background:'#00F'}} ref="middle">
      <span style={{padding:10,background:'#0F0'}} ref="inner">123</span>
      <div style={{position:'absolute',top:200,left:0}}>next</div>
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
