let o = karas.render(
  <canvas width="360" height="360">
    <div style={{fontSize: 60, fontFamily:'alipay'}}>123</div>
    <span style={{fontSize: 60}}>123</span>
  </canvas>,
  '#test'
);
karas.style.font.register('alipay', 'AlipayNumber-Regular.ttf', {});

o.on(karas.Event.REFRESH, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
