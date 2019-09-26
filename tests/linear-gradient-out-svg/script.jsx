let o = karas.render(
  <canvas width="360" height="360">
    <div style={{marginBottom:5,height:50,background:`linear-gradient(#0F0 -100%, #00F 200%)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(100deg, #F00 -100%, #000, #00F 200%)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(200deg, #F00 -100%, #00F 200%)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(300deg, #F00 -100%, #000, #00F 200%)`}}/>
  </canvas>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
