let root = karas.render(
  <canvas width="360" height="360" cache="1">
    <div ref="a" style={{width:100,height:100,background:'#00F'}}/>
    <div ref="b" style={{width:100,height:100,background:'#F00'}} cacheAsBitmap={1}/>
  </canvas>,
  '#test'
);
root.ref.a.updateStyle({
  height: 120,
}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
