let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:'60 0',width:250,background:'#CCC'}}>
      <span style={{margin:10,padding:50,background:['url(../../image.png) no-repeat center','#F00']}}>1</span>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
