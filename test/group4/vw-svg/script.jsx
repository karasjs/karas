let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'relative',
      left: '5vw',
      top: '5vw',
      margin: '5vw',
      padding: '5vw',
      width:'25vw',
      height:'25vw',
      border:'5vw solid #F00',
      borderRadius: '1vw',
      fontSize:'10vw',
      lineHeight:'25vw',
      letterSpacing: '5vw',
      background: 'url(../../image.png) no-repeat 5vw 5vw',
      backgroundSize: '25vw 25vw',
    }}>ab</div>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
