let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <span style={{order:1}}>1</span>
      <span>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
