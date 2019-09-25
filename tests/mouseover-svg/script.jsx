function cb(color) {
  render(color);
}
function render(color) {
  let o = karas.render(
    <svg width="360" height="360">
      <div style={{background:color}} onMouseMove={()=>cb('#00F')}>#00F</div>
      <div style={{background:color}} onMouseMove={()=>cb('#F00')}>#F00</div>
    </svg>,
    '#test'
  );
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}
render('#0F0');
