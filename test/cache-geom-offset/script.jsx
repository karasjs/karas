let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <img src="../logo.png" style={{display:'block'}}/>
    <div style={{height:100,background:'#FFF'}}>
      <$rect style={{display:'inline',width:50,height:50}}/>
    </div>
  </canvas>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
