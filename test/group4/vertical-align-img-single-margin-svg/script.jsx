let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:200,fontSize:100,background:'#F00'}}><img src="../../logo.png" style={{marginBottom:30,background:'#00F'}}/></div>a
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
