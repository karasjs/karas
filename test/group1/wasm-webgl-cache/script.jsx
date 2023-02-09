karas.wasm.init('../../../karas_bg.wasm', function() {
  karas.render(
    <webgl width="360" height="360">
      <div cacheAsBitmap={1}
           style={{
             position: 'absolute',
             left: '50%',
             top: '50%',
             background: '#F00',
             width: 10,
             height: 10,
             translateX: -50,
           }}>
              <span style={{
                position: 'absolute',
                left: 10,
                top: 10,
                width: 10,
                height: 10,
                background: '#000',
                translateY: -50,
              }}/>
      </div>
    </webgl>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
