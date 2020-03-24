let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:'100%',background:'url(../image.png)'}}/>
  </canvas>,
  '#test'
);

o.on('refresh', () => {
  let input = document.querySelector('#base64');
  input.value = 'refresh';
});
