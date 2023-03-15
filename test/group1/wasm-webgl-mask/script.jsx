karas.wasm.init('../../../karas_bg.wasm', function() {
  karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <div style={{
        width: 100,
        height: 100,
        background: '#F00',
        translateX: 50,
      }}/>
      <$rect style={{
        position: 'absolute',
        left: 80,
        top: 60,
        width: 20,
        height: 20,
        rotateZ: 45,
        fill: '#FFF',
      }} mask={1}/>
    </webgl>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
