let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',alignItems:'center'}}>
      <span style={{height:100,background:'#F00'}}>1</span>
      <span style={{alignSelf:'flex-end',height:70,background:'#0F0'}}>2</span>
      <span style={{alignSelf:'flex-start',height:40,background:'#00F'}}>3</span>
      <span style={{alignSelf:'stretch',background:'#EEE'}}>4</span>
      <span style={{height:40,background:'#999'}}>5</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
