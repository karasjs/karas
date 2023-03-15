let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{width:50,height:50,background:'#F00',filter:'hue-rotate(30deg)'}}/>
    <div style={{width:50,height:50,background:'#39F',filter:'hue-rotate(30deg)'}}/>
    <div style={{width:50,height:50,background:'#F93',filter:'hue-rotate(60deg)'}}/>
  </webgl>,
  '#test'
);
