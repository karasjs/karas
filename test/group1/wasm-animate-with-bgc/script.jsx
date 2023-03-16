karas.wasm.init('../../../karas_bg.wasm', function() {
  let root = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
      <div ref="div" style={{
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
      translateX: 50,
      background:'#00F',
    },
  ], {
    fill: 'forwards',
    duration: 200,
  });
  let count = 0;
  let input = document.querySelector('input');
  a.on('frame', function() {
    if(++count === 2) {
      let x = root.ref.div.getStyle('translateX');
      let bgc = root.ref.div.getStyle('backgroundColor');
      input.value = x > 0 && x < 50 && bgc[0] < 255 && bgc[0] > 0;
    }
  });
});
