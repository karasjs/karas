let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',border:'1px solid #000'}}>
      <p style={{display:'flex',background:'#F00',fontSize:40}}>AAAAAAAAAAAAAA</p>
    </div>
    <div style={{position:'absolute',top:120,border:'1px solid #000'}}>
      <p style={{display:'flex',background:'#F00',fontSize:40}}>
        <strong style={{width:200,flex:1}}>AAAAAAAAAAAAAA</strong>
      </p>
    </div>
    <div style={{position:'absolute',top:240,border:'1px solid #000'}}>
      <p style={{display:'flex',background:'#F00',fontSize:40}}>
        <strong style={{width:200}}>AAAAAAAAAA</strong>
      </p>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
