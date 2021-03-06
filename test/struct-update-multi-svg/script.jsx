let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span ref="span">1</span>
      <strong ref="strong">2</strong>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.span.updateStyle({ padding: 10 });
o.ref.strong.updateStyle({ padding: 10 }, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item[karas.enums.STRUCT_KEY.STRUCT_NODE] = item[karas.enums.STRUCT_KEY.STRUCT_NODE].tagName || 'text';
    return item;
  }));
});
