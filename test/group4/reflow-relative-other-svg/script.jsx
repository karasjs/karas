let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#00F'}} ref="middle">
      <div style={{position:'relative',left:0,padding:10,background:'#0F0'}} ref="inner">123</div>
    </div>
    <div>next</div>
  </svg>,
  '#test'
);
o.ref.inner.updateStyle({
  left: 30,
  height: 100,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
