let o = karas.render(
  <svg width="360" height="360">
    <div>123</div>
    <$circle mask="1"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.__structs.map(item => {
  item.node = item.node.tagName || 'text';
  return item;
}));
