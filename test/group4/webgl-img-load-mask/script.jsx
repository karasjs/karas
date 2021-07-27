let o = karas.render(
  <webgl width="360" height="360">
    <img src="../../logo.png" style={{position:'absolute',left:0,top:0,width:40,height:40}}/>
    <$rect mask="1" style={{position:'absolute',left:0,top:0,width:40,height:40,fill:'#FFF'}}/>

    <img src="../../logo.png" style={{position:'absolute',left:0,top:50,width:40,height:40}}/>
    <$rect mask="1" style={{position:'absolute',left:0,top:50,width:80,height:80,fill:'#FFF'}}/>
  </webgl>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
