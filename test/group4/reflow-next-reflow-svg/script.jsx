let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#00F'}} ref="middle">
      <span style={{display:'inlineBlock',padding:10,background:'#0F0'}} ref="inner">123</span>
      <div>next1</div>
    </div>
    <div style={{padding:10,background:'#F00'}} ref="next">next</div>
    <div>next2</div>
  </svg>,
  '#test'
);
o.ref.next.updateStyle({
  padding: 30,
});
o.ref.middle.updateStyle({
  padding: 30,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
