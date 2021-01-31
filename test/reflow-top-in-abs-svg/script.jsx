let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#F00'}}>
      <div style={{position:'absolute',padding:10,background:'rgba(0,255,0,0.6)'}} ref="middle">
        <div style={{position:'absolute',padding:10,background:'rgba(0,0,255,0.3)'}} ref="inner">1</div>
        <div>next0</div>
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
