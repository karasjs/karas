let o = karas.render(
  <svg width="360" height="360">
    <div style={{marginBottom:1,width:50,height:50,background:'radial-gradient(#F00 -100%, #0F0 20%, #00F)'}} />
    <div style={{width:50,height:50,background:'radial-gradient(#F00, #0F0 20%, #00F 200%)'}} />
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
