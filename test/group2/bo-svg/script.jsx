let o = karas.render(
  <svg width="360" height="360">
    <$polygon points={[
      [
        [0, 0],
        [0.6, 0],
        [0.6, 0.6],
        [0, 0.6]
      ],
      [
        [0.4, 0.2],
        [1, 0.2],
        [1, 1],
        [0.4, 1]
      ]
    ]} multi={true} booleanOperations={'union'} style={{
      position: 'absolute',
      left: 20,
      top: 20,
      width: 200,
      height: 200,
      fill: '#F00',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
