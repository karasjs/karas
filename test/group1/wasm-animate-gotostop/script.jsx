karas.wasm.init('../../../karas_bg.wasm', function() {
  let root = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <div style={{
        width: 50,
        height: 50,
        background: '#F00',
        translateX: 50,
      }}/>
    </webgl>,
    '#test'
  );
  let a = root.children[0].animate([
    {},
    {
      translateY: 100,
    },
  ], {
    duration: 1000,
  });
  a.gotoAndStop(500, function() {
    let input = document.querySelector('#base64');
    input.value = document.querySelector('canvas').toDataURL();
  });
});
