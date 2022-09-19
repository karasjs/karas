let o = karas.render(
  <svg width="360" height="360">
    <div ref="div"
         style={{marginBottom:5,height:50,background:`linear-gradient(#F00, #00F)`}}/>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  opacity: 0.5,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
