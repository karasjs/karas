let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <img src="error"/>
    </div>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
