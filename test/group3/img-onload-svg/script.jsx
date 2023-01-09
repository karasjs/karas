let o = karas.render(
  <svg width="360" height="360">
    <img src="../../image.png" onLoad={() => {
      let input = document.querySelector('#base64');
      input.value = 1;
    }}/>
  </svg>,
  '#test'
);

