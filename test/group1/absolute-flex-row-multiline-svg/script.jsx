let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',border:'1px solid #000'}}>
      <p style={{display:'flex',flexWrap:'wrap',background:'#F00',fontSize:40}}>
        <span style={{width:200,background:'#0F0'}}>A</span>
        <span style={{width:300,background:'#00F'}}>B</span>
      </p>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
