let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:140,height:140,background:'#F00'}}/>
  </svg>,
  '#test'
);
o.resize(200, 200, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
