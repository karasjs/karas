karas.wasm.init('../../../karas_bg.wasm', function() {
  let input = document.querySelector('#base64');
  karas.render(
    <canvas width="360" height="360">
      <div cacheAsBitmap={1}
           style={{
             position: 'absolute',
             left: 0,
             top: 0,
             background: '#F00',
             width: 10,
             height: 10,
             translateX: 50,
           }}>
              <span style={{
                position: 'absolute',
                left: 10,
                top: 10,
                width: 10,
                height: 10,
                background: '#000',
                translateY: 50,
              }} onClick={() => {
                input.value = 1;
              }}/>
      </div>
    </canvas>,
    '#test'
  );
});
