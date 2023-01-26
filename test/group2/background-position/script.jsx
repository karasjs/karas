let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png) center noRepeat'}}/>
    <div style={{height:120,background:'#0f0 url(../../image.png) right 5px noRepeat'}}/>
    <div style={{height:120,background:'#00f url(../../image.png) 50px 100% noRepeat'}}/>
  </canvas>,
  '#test'
);

o.once('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
