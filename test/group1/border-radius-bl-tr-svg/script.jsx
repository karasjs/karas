let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      width:100,
      height:100,
      border:'20px solid #000',
      borderLeftColor:'#F00',
      borderBottomLeftRadius:10,
      borderTopRightRadius:10,
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
