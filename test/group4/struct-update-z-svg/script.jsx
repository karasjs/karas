let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span ref="span" style={{position:'relative',zIndex:5}}>1</span>
      <strong style={{position:'relative',zIndex:10}}>2</strong>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.span.updateStyle({ zIndex: 20 }, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item.node = item.node.tagName || 'text';
    return item;
  }));
});
