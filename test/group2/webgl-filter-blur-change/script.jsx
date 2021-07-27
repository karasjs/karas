let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:50,top:50,width:50,height:50,background:'#00F',filter:'blur(1)'}}>abcd</div>
  </webgl>,
  '#test'
);
o.children[0].updateStyle({
  filter: 'blur(3)',
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
