let o = karas.render(
  <svg width="360" height="360">
    <$rect rx="1" ry="1" style={{margin:'2px',width:50,height:50}}/>
    <$rect rx="0.1" ry="0.3" style={{margin:'2px',width:50,height:50}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
