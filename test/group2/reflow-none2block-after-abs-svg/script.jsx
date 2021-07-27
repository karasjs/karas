let o = karas.render(
  <svg width="360" height="360">
    <p style={{position:'absolute',left:100,top:100,width:100,height:100,background:'#F00',filter:'blur(2)'}}>123</p>
    <div ref="div" style={{display:'none'}}>a</div>
    <span>b</span>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  display: 'block',
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
