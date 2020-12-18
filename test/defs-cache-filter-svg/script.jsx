let o = karas.render(
  <svg width="360" height="360">
    <div ref="div"
         style={{marginBottom:5,height:50,background:'#F00',filter:'blur(1px)'}}/>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  filter: 'blur(2px)',
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
