let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:20,padding:'40 0',background:'#CCC',width:50,color:'#0FF'}}>
      <span style={{margin:10,padding:50,background:['url(../../image.png) no-repeat center', '#F00']}}>23</span>
    </div>
    <div style={{margin:20,padding:'40 0',background:'#CCC',width:50,color:'#0FF'}}>
      <span style={{margin:10,padding:50,background:['url(../../image.png) no-repeat center', '#F00']}}>233</span>
    </div>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
