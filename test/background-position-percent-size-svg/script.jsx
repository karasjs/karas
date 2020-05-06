let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
    <div style={{width:50,height:50,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
    <div style={{width:200,height:200,background:'#000 url(../image.png) 100% 0 no-repeat',backgroundSize:'100% 100%'}}/>
  </svg>,
  '#test'
);

o.on('refresh', () => {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
