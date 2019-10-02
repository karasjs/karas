let o = karas.render(
  <svg width="360" height="360">
    <$ellipse style={{width:100,height:50,fill:'radial-gradient(#F00, #00F)'}}/>
    <$ellipse style={{width:100,height:50,fill:'radial-gradient(#F00, #00F)'}} rx="0.5" ry="0.5"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
