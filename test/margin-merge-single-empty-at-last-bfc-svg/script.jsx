let o = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#00F'}}>
      <div style={{height:20,background:'#F00'}}>1</div>
      <div style={{background:'#0F0',margin:'20 20 10'}}></div>
    </div>
    <div>2</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
