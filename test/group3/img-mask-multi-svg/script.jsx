karas.inject.measureImg('../../image.png', function() {
  let o = karas.render(
    <svg width="360" height="360">
      <img src="../../image.png"/>
      <$polygon style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        strokeWidth: 0,
        fill: '#FFF',
      }} multi={true} mask={true} points={[
        [
          [0, 0],
          [1, 0],
          [0.5, 1],
        ],
      ]}/>
    </svg>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});

