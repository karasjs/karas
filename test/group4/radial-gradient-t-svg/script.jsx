let o = karas.render(
  <svg width="360" height="360">
    <div style={{marginBottom:1,width:100,height:100,background:'radial-gradient(0.2 0.2 0.5 0.5 0.4 0.4 1, #0F0, #F0F)'}} />
    <$rect style={{width:100,height:100,fill:'radialGradient(0.2 0.2 0.5 0.5 0.4 0.4 1, #F00, #00F)'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
