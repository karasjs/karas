let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:120,background:'#000 url(../image.png) no-repeat',backgroundSize:'contain'}}/>
    <div style={{height:50,background:'#0f0 url(../image.png) no-repeat',backgroundSize:'contain'}}/>
    <div style={{width:50,height:120,background:'#00f url(../image.png) no-repeat',backgroundSize:'contain'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
