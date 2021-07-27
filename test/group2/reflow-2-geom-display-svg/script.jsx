let o = karas.render(
  <svg width="360" height="360">
    <$rect style={{width:100,height:100,background:'#F00',display:'none'}}/>
    <$line style={{width:100,height:100,background:'#00F',display:'none'}}/>
  </svg>,
  '#test'
);
o.children[0].updateStyle({
  display: 'block',
});
o.children[1].updateStyle({
  display: 'block',
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
