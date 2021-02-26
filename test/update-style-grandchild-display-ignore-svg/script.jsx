let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'none'}} ref="div">
        <span ref="span">
          <$rect ref="rect" style={{width:10,height:10}}/>
        </span>
    </div>
  </svg>,
  '#test'
);
o.ref.rect.updateStyle({
  width: 20,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
