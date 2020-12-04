let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span>1</span>
      <strong>2</strong>
      <div>3</div>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.__structs.map(item => {
  item[karas.enums.STRUCT_NODE] = item[karas.enums.STRUCT_NODE].tagName || 'text';
  return item;
}));
