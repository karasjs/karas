let root = karas.render(
  <svg width="360" height="360">
    <div>a</div>
  </svg>,
  '#test'
);
root.on('refresh', function(lv) {
  let input = document.querySelector('#base64');
  input.value = lv;
});
root.appendChild(<div>b</div>);
