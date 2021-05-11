let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span style={{display:'inlineBlock',width:300,background:'#F00'}}>a</span>
      <span style={{display:'inlineBlock',margin:10,padding:10,background:'#00F'}}>
          <img src="../logo.png"/>
        </span>
    </div>
    <div>
      <span style={{display:'inlineBlock',width:300,background:'#F00'}}>a</span>
      <span style={{display:'inlineBlock',margin:10,padding:10,background:'#00F'}}>
          <$rect style={{display:'inline',width:50,height:50}}/>
        </span>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
