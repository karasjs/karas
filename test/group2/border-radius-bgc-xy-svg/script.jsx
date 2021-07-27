let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      width: 100,
      height: 50,
      background: '#f00',
      borderTopLeftRadius: '60% 20%',
      borderTopRightRadius: '60% 10px',
      borderBottomRightRadius: '10%',
      borderBottomLeftRadius: 10,
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let svg = document.querySelector('svg');
input.value = svg.outerHTML;
