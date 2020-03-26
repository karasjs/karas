let o = karas.render(
  <svg width="360" height="360">
    <span style={{position:'absolute',left:25.09970000000067,background:'#f00'}}>精度</span>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
