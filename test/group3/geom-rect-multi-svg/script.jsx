let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{margin:'2px',width:100,height:50}} rx={[0.1, 0.4]} multi={true}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
