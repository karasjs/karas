let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
    <$rect mask={1}
           ref="m"
           style={{
             position: 'absolute',
             left: 0,
             top: 0,
             width: 10,
             height: 10,
             fill: '#FFF',
             strokeWidth: 0,
           }}/>
  </svg>,
  '#test'
);
o.ref.m.updateStyle({
  translateX: 20,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
