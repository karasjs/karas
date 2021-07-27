let o = karas.render(
  <svg width="360" height="360">
    <div>123</div>
    <$circle mask="1"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.__structs.map(item => {
  item[karas.enums.STRUCT_KEY.STRUCT_NODE] = item[karas.enums.STRUCT_KEY.STRUCT_NODE].tagName || 'text';
  return item;
}));
