let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'relative',
      left: '1rem',
      top: '1rem',
      margin: '1rem',
      padding: '1rem',
      width:'5rem',
      height:'5rem',
      border:'1rem solid #F00',
      borderRadius: '0.2rem',
      fontSize:'2rem',
      lineHeight:'5rem',
      letterSpacing: '1rem',
      background: 'url(../../image.png) no-repeat 1rem 1rem',
      backgroundSize: '5rem 5rem',
    }}>ab</div>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
