let o = karas.render(
  <svg width={360} height={360}>
    <div ref="d1" style={{
      position: 'absolute',
      left: 100,
      top: 100,
      width: 100,
      height: 30,
    }}>
        <span style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background:'url(../image.png) no-repeat 0 0',
          backgroundSize: '100% auto',
        }}/>
    </div>
    <span ref="d2" style={{
      position: 'absolute',
      left: 100,
      top: 200,
      width: 100,
      height: 30,
      background:'url(../image.png) no-repeat 0 0',
      backgroundSize: '100% auto',
    }}/>
  </svg>,
  '#test'
);
setTimeout(function() {
  o.ref.d2.updateStyle({
    opacity: 0.5,
  }, function() {
    let input = document.querySelector('#base64');
    input.value = document.querySelector('svg').outerHTML;
  });
}, 200);
