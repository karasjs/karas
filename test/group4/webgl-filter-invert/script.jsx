let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:90,height:80,background:'#F00',filter:'invert(100%)'}}>123</div>
  </webgl>,
  '#test'
);
