let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:100}}>
      <span style={{flex:'1 1 50',background:'#F00',padding:'0 5'}}>2</span>
      <span style={{flex:'1 1 40',background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',width:100}}>
      <span style={{flex:'1 1 auto',background:'#F00'}}><strong style={{display:'block',padding:'0 5'}}>2</strong></span>
      <span style={{flex:'1 1 auto',background:'#00F'}}><strong style={{display:'block'}}>3</strong></span>
    </div>
    <div style={{display:'flex',width:100}}>
      <span style={{flex:'1 1 auto',background:'#F00'}}><strong style={{display:'block',padding:'0 5%'}}>2</strong></span>
      <span style={{flex:'1 1 auto',background:'#00F'}}><strong style={{display:'block'}}>3</strong></span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
