let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      width:240,
      height:200,
      border:'60px dashed rgba(0,0,0,0.5)',
      borderBottomColor: 'rgba(255,0,0,0.5)',
      borderLeftColor: 'rgba(0,255,0,0.5)',
      borderRightColor: 'rgba(0,0,255,0.5)',
      borderRadius: '50 30',
      background:'#F00',
    }}/>  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
