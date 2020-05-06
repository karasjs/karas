let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:50,height:50,background:'#00f url(../image.png) no-repeat',backgroundSize:'auto 100%'}}/>
    <div style={{position:'absolute',left:200,top:200,width:50,height:50,background:'#00f url(../image.png) no-repeat',backgroundSize:'100% auto'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
