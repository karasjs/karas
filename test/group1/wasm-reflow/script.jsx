karas.wasm.init('../../../karas_bg.wasm', function() {
  let o = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <div style={{
        width: 50,
        height: 50,
        background: '#F00',
        translateX: '100%',
        translateY: '100%',
      }}/>
    </webgl>,
    '#test'
  );
  o.children[0].updateStyle({
    width: 100,
    height: 100,
  }, function() {
    let input = document.querySelector('#base64');
    input.value = document.querySelector('canvas').toDataURL();
  });
});
