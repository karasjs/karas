let o = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#F00',margin:5}}>1</div>
    <div style={{background:'#0F0',margin:25}} ref="b"/>
    <div style={{position:'absolute',background:'#00F'}}>2</div>
    <div>next</div>
  </svg>,
  '#test'
);
o.ref.b.updateStyle({
  margin: 15,
}, function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
