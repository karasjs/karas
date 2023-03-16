karas.wasm.init('../../../karas_bg.wasm', function() {
  karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
      <div style={{
        width: 100,
        height: 100,
        background: '#F00',
        translateX: 50,
        translateY: 50,
        perspective: 500,
      }}>
        <div style={{
          width: 100,
          height: 100,
          background: '#00F',
          rotateY: 45,
        }}/>
      </div>
    </webgl>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
