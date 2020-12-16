let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{position:'absolute',left:100,top:100,width:90,height:80,background:'#F00',filter:'blur(5)'}}>123</div>
  </svg>,
  '#test'
);

o.ref.div.updateStyle({
  filter: null,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
