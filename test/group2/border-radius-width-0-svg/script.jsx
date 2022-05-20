let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      width:0,
      height:28,
      background: '#f00',
      borderTopLeftRadius: 21,
      borderTopRightRadius: 21,
      borderBottomRightRadius: 21,
      border: '10px solid #00f',
    }}/></svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
