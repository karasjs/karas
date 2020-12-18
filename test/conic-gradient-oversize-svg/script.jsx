let o = karas.render(
  <svg width="360" height="360">
    <$polygon points={[
      [0, 0],
      [1, -1],
      [1, 1],
    ]} style={{
      position: 'absolute',
      left: 50,
      top: 180,
      width: 150,
      height: 150,
      fill: 'conicGradient(#F00, #00F)',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
