let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      width: 100,
      height: 100,
      background: '#f00',
      borderRadius: 30,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 40,
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let svg = document.querySelector('svg');
input.value = svg.outerHTML;
