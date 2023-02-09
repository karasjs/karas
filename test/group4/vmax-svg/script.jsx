let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'relative',
      left: '5vmax',
      top: '5vmax',
      margin: '5vmax',
      padding: '5vmax',
      width:'25vmax',
      height:'25vmax',
      border:'5vmax solid #F00',
      borderRadius: '1vmax',
      fontSize:'10vmax',
      lineHeight:'25vmax',
      letterSpacing: '5vmax',
      background: 'url(../../image.png) no-repeat 5vmax 5vmax',
      backgroundSize: '25vmax 25vmax',
    }}>ab</div>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
