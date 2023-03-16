let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      background: '#F00',
      filter: ['contrast(10%)', 'contrast(10%)'],
    }}/>
    <div style={{
      position: 'absolute',
      left: 150,
      top: 150,
      width: 100,
      height: 100,
      background: '#00F',
      filter: ['contrast(10%)', 'contrast(10%)'],
    }}/>
  </webgl>,
  '#test'
);
o.children[0].updateStyle({
  filter: ['grayscale(80%)'],
});
o.children[1].updateStyle({
  filter: ['grayscale(80%)'],
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
