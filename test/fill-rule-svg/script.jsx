let o = karas.render(
  <svg width="360" height="360">
    <$polygon style={{
      width: 100,
      height: 100,
      fill: '#F00',
      fillRule: 'evenodd',
    }} points={[
      [0, 0.3],
      [1, 0.3],
      [0.2, 0.8],
      [0.5, 0],
      [0.8, 0.8],
    ]}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
