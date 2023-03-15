karas.wasm.init('../../../karas_bg.wasm', function() {
  let o = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <div style={{
        width: 50,
        height: 50,
        background: '#F00',
        translateX: 100,
      }}/>
    </webgl>,
    '#test'
  );
  o.children[0].updateStyle({
    translateX: 50,
    width:60,
  }, function() {
    let input = document.querySelector('#base64');
    input.value = document.querySelector('canvas').toDataURL();
  });
});
