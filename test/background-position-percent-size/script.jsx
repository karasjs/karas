let o = karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
    <div style={{width:50,height:50,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
    <div style={{width:200,height:200,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
  </canvas>,
  '#test'
);

o.on('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
