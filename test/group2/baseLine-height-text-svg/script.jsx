let o = karas.render(
  <svg width="360" height="360">
    <span style={{
      display:'inlineBlock',
      width: 32,
      height: 32,
      background: '#F00',
    }}/>
    <strong>123</strong>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
