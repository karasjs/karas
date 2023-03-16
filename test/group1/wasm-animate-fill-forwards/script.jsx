karas.wasm.init('../../../karas_bg.wasm', function() {
  let root = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
      <div style={{
        width: 50,
        height: 50,
        background: '#F00',
      }}/>
    </webgl>,
    '#test'
  );
  let a = root.children[0].animate([
    {},
    {
      translateX: 100,
    },
  ], {
    duration: 200,
    fill: 'forwards',
  });
  let input = document.querySelector('#base64');
  a.on('finish', function() {
    input.value += document.querySelector('canvas').toDataURL();
  });
});
