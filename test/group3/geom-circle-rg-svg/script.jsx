let o = karas.render(
  <svg width="360" height="360">
    <$circle style={{width:50,height:50,fill:'radial-gradient(#F00, #00F)'}}/>
    <$circle style={{width:50,height:50,fill:'radial-gradient(#F00, #00F)'}} r="0.5"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
