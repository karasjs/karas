let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:50,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)'}}>2<strong style={{padding:'0 3',background:'rgba(0,0,255,0.3)'}}>33</strong>2</span>
    </div>
    <div style={{margin:10,width:50,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)'}}>2<strong style={{padding:'0 3',background:'rgba(0,0,255,0.3)'}}>3333</strong>2</span>
    </div>
    <div style={{margin:10,width:50,background:'rgba(0,0,0,0.3)'}}>
      <span style={{padding:'2 5',background:'rgba(255,0,0,0.3)',borderRadius:5,border:'2px solid rgba(0,255,0,0.5)'}}>2<strong style={{padding:'0 3',background:'rgba(0,0,255,0.3)'}}>3<span style={{padding:'0 3',background:'rgba(0,255,0,0.3)'}}>4</span>3</strong>2</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
