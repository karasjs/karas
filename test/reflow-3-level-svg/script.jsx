let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#F00'}}>
      <div style={{padding:10,background:'#0F0'}} ref="middle">
        <div style={{padding:10,background:'#00F'}} ref="inner">1</div>
      </div>
      <div>next1</div>
    </div>
    <div>next2</div>
  </svg>,
  '#test'
);
o.ref.inner.updateStyle({
  padding: 30,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
