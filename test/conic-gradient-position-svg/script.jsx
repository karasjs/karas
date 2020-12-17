let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 50,
      top: 50,
      width: 200,
      height: 180,
      background: 'conicGradient(from 30deg at 40% 40%, #F00, #0F0, #00F)',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
