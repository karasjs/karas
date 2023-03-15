karas.wasm.init('../../../karas_bg.wasm', function() {
  let root = karas.render(
    <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <div ref="div" style={{
        width: 50,
        height: 50,
        background: '#F00',
      }}/>
    </webgl>,
    '#test'
  );
  let div = root.ref.div;
  let a1 = div.animate([
    {},
    {
      translateX: 50,
    }
  ], {
    duration: 200,
    fill: 'forwards',
  });
  let a2 = div.animate([
    {},
    {
      background: '#00F',
    }
  ], {
    duration: 200,
    fill: 'forwards',
  });
  let a3 = div.animate([
    {},
    {
      translateY:50,
    }
  ], {
    duration: 200,
    fill: 'forwards',
  });
  let input = document.querySelector('#base64');
  let count = 0;
  a3.on('frame', () => {
    if(++count === 2) {
      let x = div.getStyle('translateX');
      let y = div.getStyle('translateY');
      let bgc = div.getStyle('backgroundColor');
      input.value = x > 0 && x < 50 && y > 0 && y < 50 && bgc[0] < 255 && bgc[0] > 0;
    }
  });
  a3.on('finish', function() {
    input.value += '/finish';
  });
});
