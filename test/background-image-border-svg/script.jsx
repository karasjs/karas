let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      border: '5px solid #0F0',
      background:'url(../image.png) noRepeat 0 0',
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
