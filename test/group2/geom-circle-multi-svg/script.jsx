let o = karas.render(
  <svg width="360" height="360">
    <$circle style={{width:100,height:100}} r={[0.1, 0.5]} multi={true}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
