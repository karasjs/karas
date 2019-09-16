function cb(color) {
  render(color);
}
function render(color) {
  karas.render(
    <canvas width="360" height="360">
      <div style={{background:color}} onMouseMove={()=>cb('#00F')}>#00F</div>
      <div style={{background:color}} onMouseMove={()=>cb('#F00')}>#F00</div>
    </canvas>,
    '#test'
  );
  var canvas = document.querySelector('canvas');
  var input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
}
render('#0F0');
