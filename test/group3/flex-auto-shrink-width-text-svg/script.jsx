let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:30}}>
      <span style={{flex:'auto',background:'#F00'}}>1</span>
      <span style={{flex:'auto',background:'#00F'}}>2</span>
      {3}
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
