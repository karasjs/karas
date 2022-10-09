let root = karas.render(
  <canvas width="360" height="360">
    <div style={{margin:'0 auto',width:100,background:'#F00'}}>1</div>
  </canvas>,
  '#test'
);

root.children[0].updateStyle({width:200}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
