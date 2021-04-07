let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <span style={{flex:1}}>22222222222222222222222222222222222222</span>
      <img style={{marginLeft:10,height:50}} src="../image.png"/>
    </div>
    <div style={{display:'flex'}}>
      <span style={{flex:1}}>22222222222222222222222222222222222222</span>
      <img style={{marginLeft:10,width:25,height:50}} src="../image.png"/>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
