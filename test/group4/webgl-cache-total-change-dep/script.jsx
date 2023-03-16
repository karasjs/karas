let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div ref="div" style={{width:100,height:100,background:'#F00'}}>aaaaaa</div>
    <$rect mask={1} style={{position:'absolute',left:20,top:0,width:100,height:100,fill:'#FFF'}}/>
  </webgl>,
  '#test'
);

o.ref.div.updateStyle({
  filter: 'blur(1)'
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
