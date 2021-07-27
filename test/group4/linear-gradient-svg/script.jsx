let o = karas.render(
  <svg width="360" height="360">
    <div style={{marginBottom:5,height:50,background:`linear-gradient(#0F0 10%, #F00, #00F)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(100deg, #F00 50px, #00F)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(200deg, #F00 0%, #00F)`}}/>
    <div style={{marginBottom:5,height:50,background:`linear-gradient(300deg, #F00, #00F)`}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
