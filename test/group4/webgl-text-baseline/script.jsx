let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{width:100}}>
      <span style={{color:'#F00'}}>aaa</span>
      <span style={{fontSize:40,color:'#00F'}}>bbb</span>
    </div>
  </webgl>,
  '#test'
);
