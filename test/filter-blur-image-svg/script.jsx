let o = karas.render(
  <svg width="360" height="360">
    <img src="../image.png" style={{filter:'blur(1)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
