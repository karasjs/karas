let o = karas.render(
  <svg width="360" height="360">
    <$polygon points={[
      [
        [100, 100],
        [200, 100],
        [200, 200],
        [100, 200],
      ],
      [
        [210, 100],
        [310, 100],
        [310, 200],
        [210, 200],
      ]
    ]} controls={[
      [
        [],
        [],
        [],
        [],
      ],
      [
        [],
        [],
        [],
        [160, 150],
      ],
    ]} multi={true} booleanOperations={'intersection'} style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 1,
      height: 1,
      fill: '#F00',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
