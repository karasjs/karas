let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{width:50,height:50,background:'#F00',filter:'brightness(50%)'}}/>
    <div style={{width:50,height:50,background:'#39F',filter:'brightness(50%)'}}/>
    <div style={{width:50,height:50,background:'#F93',filter:'brightness(30%)'}}/>
  </webgl>,
  '#test'
);
