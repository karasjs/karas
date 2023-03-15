let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
      <$circle cacheAsBitmap={1}
               style={{margin:20,display:'block',width:100,height:100,background:'#F00',overflow:'hidden',filter:'blur(2)'}}
               r={1.1}/>
      <$circle style={{margin:20,display:'block',width:100,height:100,background:'#F00',overflow:'hidden',filter:'blur(2)'}}
               r={1.1}/>
  </webgl>,
  '#test'
);
