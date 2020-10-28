let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,padding:10,background:'#00F'}} ref="middle">
      <span style={{position:'absolute',padding:10,background:'#0F0'}} ref="inner">123</span>
    </div>
    <div>next</div>
  </svg>,
  '#test'
);
o.ref.middle.updateStyle({
  padding: 30,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
