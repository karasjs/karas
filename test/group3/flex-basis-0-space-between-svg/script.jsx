let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',justifyContent:'spaceBetween'}}>
      <span style={{flexBasis:0}}>1</span>
      <span style={{flexBasis:0}}>2</span>
      <span style={{flexBasis:0}}>3</span>
      <span style={{flexBasis:0}}>4</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
