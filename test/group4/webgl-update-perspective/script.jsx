let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:100,height:100,
      perspective:500}} ref="div">
      <div style={{width:100,height:100,
        background:'linear-gradient(#F00,#00F)',transform:'rotateX(45)'}}/>
    </div>
  </webgl>,
  '#test'
);
o.ref.div.updateStyle({
  perspective: 200,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
