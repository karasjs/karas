let o = karas.render(
  <svg width="360" height="360" style={{fontSize:50}}>
    <div style={{display:'flex'}}>
      <span style={{border:'0.1rem solid #000'}}>ab</span>
      <img style={{width:'1rem'}} src="../image.png"/>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
