let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{
      position: 'absolute',
      left: 10,
      top: 10,
      width: 100,
      height: 50,
      fill: 'radialGradient(circle, #f00, #00f)',
    }}/>
    <$rect style={{
      position: 'absolute',
      left: 150,
      top: 10,
      width: 100,
      height: 50,
      fill: 'radialGradient(ellipse, #f00, #00f)',
    }}/>
    <$rect style={{
      position: 'absolute',
      left: 10,
      top: 80,
      width: 100,
      height: 50,
      fill: 'radialGradient(circle closest-side, #f00, #00f)',
    }}/>
    <$rect style={{
      position: 'absolute',
      left: 150,
      top: 80,
      width: 100,
      height: 50,
      fill: 'radialGradient(circle closest-corner, #f00, #00f)',
    }}/>
    <$rect style={{
      position: 'absolute',
      left: 10,
      top: 160,
      width: 100,
      height: 50,
      fill: 'radialGradient(circle farthest-side, #f00, #00f)',
    }}/>
    <$rect style={{
      position: 'absolute',
      left: 150,
      top: 160,
      width: 100,
      height: 50,
      fill: 'radialGradient(circle closest-corner at 80% 50%, #f00, #00f)',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
