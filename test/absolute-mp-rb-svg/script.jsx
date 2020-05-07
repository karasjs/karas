let o = karas.render(
  <svg width="360" height="360">
    <span style={{
      position: 'absolute',
      right:0,
      bottom:0,
      padding: 50,
      width:100,
      height:100,
      background:'#F00',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
