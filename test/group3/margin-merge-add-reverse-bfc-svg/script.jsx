let o = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#F00',margin:-5}}>1</div>
    <div style={{background:'#0F0',margin:10}}>
      <div style={{margin:20,background:'#00F'}}>2</div>
    </div>
    <div>3</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
