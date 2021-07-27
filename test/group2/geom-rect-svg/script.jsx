let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{margin:'2px',width:100,height:50,stroke:'#F00'}}/>
    <$rect style={{margin:'2px',width:100,height:50}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
