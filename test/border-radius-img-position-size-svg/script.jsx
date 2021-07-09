let o = karas.render(
  <svg width="360" height="360">
    <img src="../image.png" style={{
      position: 'absolute',
      left: 100,
      top: 100,
      width: 80,
      height: 60,
      borderRadius: 10,
    }}/>
  </svg>,
  '#test'
);
o.on('refresh', () => {
  let input = document.querySelector('#base64');
  let svg = document.querySelector('svg');
  input.value = svg.innerHTML;
});
