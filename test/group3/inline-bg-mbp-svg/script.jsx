let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:30,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)'}}>2</span>
    </div>
    <div style={{margin:10,width:30,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)'}}>222</span>
    </div>
    <div style={{margin:10,width:30,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)',boxShadow:'0 0 5px #00F'}}>22222</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
