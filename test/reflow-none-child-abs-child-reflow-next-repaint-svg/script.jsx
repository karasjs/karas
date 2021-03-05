let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',display:'none'}} ref="div">
      <span ref="span" style={{position:'absolute'}}>
        <$rect ref="$rect"/>
      </span>
    </div>
    <b style={{width:100,height:100,background:'#F00'}} ref="b"/>
  </svg>,
  '#test'
);
o.ref.$rect.updateStyle({
  width: 1,
});
o.ref.b.updateStyle({
  translateX: 1,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
