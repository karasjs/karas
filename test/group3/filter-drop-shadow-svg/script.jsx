let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      margin:20,
      width: 100,
      height: 100,
      border: '1px solid #000',
      filter: 'drop-shadow(2 2 3 #F00)',
    }}>123</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
