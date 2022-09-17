let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',width:100,height:100,background:'#00F'}} ref="middle"/>
    <p>next</p>
  </svg>,
  '#test'
);
o.ref.middle.updateStyle({
  position: 'static',
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom) + o.absChildren.length;
});
