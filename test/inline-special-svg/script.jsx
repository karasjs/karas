let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:20,padding:'40 0',background:'#CCC',width:50,color:'#0FF'}}>
      <span style={{margin:10,padding:50,background:'rgba(255,0,0,0.3)'}}>23</span>
    </div>
    <div style={{margin:20,padding:'40 0',background:'#CCC',width:50,color:'#0FF'}}>
      <span style={{margin:10,padding:50,background:'rgba(255,0,0,0.3)'}}>233</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
