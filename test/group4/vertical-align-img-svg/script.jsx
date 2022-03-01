let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:200,fontSize:100,background:'#F00'}}>jj<img src="../../logo.png" style={{background:'#00F'}}/>y<img src="../../logo.png" style={{background:'#00F'}}/></div>a<div>b</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
