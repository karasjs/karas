let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:30,padding:'40 0',background:'#CCC',width:50}}>
      <span style={{margin:10,padding:50,background:['url(../../image.png) no-repeat center','#F00']}}/>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
