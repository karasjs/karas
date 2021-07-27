let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:20,background:'#F00',margin:5}}>1</div>
    <div style={{background:'#0F0',margin:0}}></div>
    <div style={{height:20,background:'#00F',margin:10}}>3</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
