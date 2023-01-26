let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:'100%'}}>
      <div style={{height:'100%',background:'url(../../image.png)'}}/>
    </div>
  </canvas>,
  '#test'
);

o.once('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
