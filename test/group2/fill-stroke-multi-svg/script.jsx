let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{
      margin: 100,
      width: 100,
      height: 100,
      stroke: [
        'rgba(0,0,0,0.5)',
        'rgba(0,255,0,0.5)',
      ],
      strokeWidth: [5, 10],
      fill: [
        'linearGradient(rgba(255,0,0,0.5),rgba(0,0,255,0.5))',
        'linearGradient(rgba(0,0,0,0.5),rgba(255,255,255,0.5))'
      ],
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
