let o = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#F00',margin:5,height:20}}></div>
    <div style={{background:'#0F0',margin:25}} ref="b"/>
    <div style={{position:'absolute',background:'#00F',width:20,height:20}}></div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
