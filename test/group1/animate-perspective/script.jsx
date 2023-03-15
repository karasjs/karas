let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:100,height:100,
      perspective:500,}} ref="div">
        <span style={{width:100,height:100,display:'block',
          background:'linear-gradient(#F00,#00F)',rotateY:45}} ref="span"/>
    </div>
  </webgl>,
  '#test'
);
let t = o.ref.div;
let animation = t.animate([
  {
    perspective: 500,
  },
  {
    perspective: 100,
  },
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.gotoAndStop(100, () => {
  input.value = document.querySelector('canvas').toDataURL();
});
