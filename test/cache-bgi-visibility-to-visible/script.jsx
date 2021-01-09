let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div ref="t"
         style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
    }}>
        <span ref="tank"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 60,
                height: 60,
                background: 'url(../image.png) no-repeat 0 0',
                visibility: 'hidden',
              }}/>
    </div>
  </canvas>,
  '#test'
);
o.ref.tank.updateStyle({
  visibility: 'inherit',
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
