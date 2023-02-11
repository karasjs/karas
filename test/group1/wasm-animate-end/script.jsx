karas.wasm.init('../../../karas_bg.wasm', function() {
  let root = karas.render(
    <webgl width="360" height="360">
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
    duration: 100,
    endDelay: 100,
    fill: 'forwards',
  });
  let input = document.querySelector('#base64');
  let isEnd, count = 0;
  a.on('frame', () => {
    if(isEnd) {
      count++;
    }
  });
  a.on('end', function() {
    isEnd = true;
    input.value += '/end';
  });
  a.on('finish', function() {
    if(isEnd) {
      isEnd = false;
    }
    input.value += '/' + (count > 2) + '/finish';
    requestAnimationFrame(function() {
      input.value += '/' + karas.animate.frame.__task.length;
    });
  });
});
