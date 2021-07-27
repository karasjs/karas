let o = karas.render(
  <svg width="360" height="360">
    <img src="../../image.png" style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      translateX: '-50%',
      rotate: 45,
    }}/>
  </svg>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  var input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
