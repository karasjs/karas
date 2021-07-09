let o = karas.render(
  <svg width="360" height="360">
    <img src="../image.png" style={{borderRadius: 10}}/>
  </svg>,
  '#test'
);
o.on('refresh',() => {
  let input = document.querySelector('#base64');
  let svg = document.querySelector('svg');
  input.value = svg.innerHTML;
});
