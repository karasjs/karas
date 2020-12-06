let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{display:'none'}}>
      <span ref="span">1</span>
    </div>
    <p>2</p>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.div.updateStyle({
  translateX: 100,
}, function() {
  input.value = JSON.stringify(o.virtualDom);
});
