let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:50,background:'#CCC'}}>
      <span style={{background:'#F00'}}>22<strong style={{fontSize:40,padding:'0 0 0 10',background:'rgba(0,0,255,0.3)'}}>3</strong></span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
