let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:100,margin:5,padding:5,background:'#F00'}}>
      <p style={{flex:'1 1 auto',background:'#0F0'}}>111</p>
      <span style={{flex:'1 1 auto',background:'#00F'}}>2</span>
    </div>
    <div style={{display:'flex',width:100,margin:5,padding:5,background:'#F00'}}>
      <p style={{flex:'1 1 auto',background:'#0F0'}}>1111111111111</p>
      <span style={{flex:'1 1 auto',background:'#00F'}}>22222</span>
    </div>
    <div style={{display:'flex',width:100,margin:5,padding:5,background:'#F00'}}>
      <p style={{flex:'1 1 auto',background:'#0F0',whiteSpace:'nowrap'}}>111</p>
      <span style={{flex:'1 1 auto',background:'#00F',whiteSpace:'nowrap'}}>2</span>
    </div>
    <div style={{display:'flex',width:100,margin:5,padding:5,background:'#F00'}}>
      <p style={{flex:'1 1 auto',background:'#0F0',whiteSpace:'nowrap'}}>1111111111111</p>
      <span style={{flex:'1 1 auto',background:'#00F',whiteSpace:'nowrap'}}>22222</span>
    </div>
    <div style={{display:'flex',width:100,margin:5,padding:5,background:'#F00',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>1111111111111111111111</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
