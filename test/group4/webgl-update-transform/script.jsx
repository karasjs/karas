let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div ref="div" style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'#F00'}}>
      <p style={{background:'#FFF'}}>abc</p>
    </div>
  </webgl>,
  '#test'
);
o.ref.div.updateStyle({
  scaleY: 0.5,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
