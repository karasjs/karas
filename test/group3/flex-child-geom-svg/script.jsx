let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <$circle style={{width:20,height:20}}/>
      <span>123</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
