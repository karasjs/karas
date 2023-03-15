let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{margin:50,background:'#F00',filter:'blur(5)',overflow:'hidden'}}>
      <span>1</span>
    </div>
  </webgl>,
  '#test'
);
