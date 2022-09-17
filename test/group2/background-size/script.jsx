let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png) noRepeat',backgroundSize:'100% 100%'}}/>
    <div style={{height:120,background:'#0f0 url(../../image.png) noRepeat',backgroundSize:'50px 80px'}}/>
    <div style={{height:120,background:'#00f url(../../image.png) noRepeat',backgroundSize:'auto 50px'}}/>
  </canvas>,
  '#test'
);

o.on('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
