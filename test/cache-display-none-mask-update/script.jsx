let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{
      position:'relative',
      width: 100,
      height: 100,
      background: '#00F',
    }}>
      <span ref="t" style={{display:'none'}}>123456</span>
      <$rect mask="1" style={{
        position:'absolute',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        fill: '#F99',
      }}/>
    </div>
  </canvas>,
  '#test'
);

o.ref.t.updateStyle({
  display: 'block',
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
