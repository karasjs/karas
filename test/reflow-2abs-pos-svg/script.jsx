let o = karas.render(
  <svg width="360" height="360">
    <span style={{position:'absolute',left:0,top:0,width:'50%',height:'50%',background:'rgba(255,0,0,0.5)'}}>cccc</span>
    <div ref="div">aaa</div>
    <p>bbbb</p>
  </svg>,
  '#test'
);
o.ref.div.updateStyle({
  position: 'absolute'
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
