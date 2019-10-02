let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{margin:'2px',width:100,height:50,fill:'linear-gradient(#F00, #00F)'}}/>
    <$rect style={{margin:'2px',width:100,height:50,fill:'radial-gradient(#F00, #00F)'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
