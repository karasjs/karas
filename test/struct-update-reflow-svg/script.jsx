let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span ref="span">1</span>
      <strong>2</strong>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.span.updateStyle({ padding: 10 }, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item.node = item.node.tagName || 'text';
    return item;
  }));
});
