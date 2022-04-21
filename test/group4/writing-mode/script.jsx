karas.render(
  <canvas width="360" height="360">
    <div style={{margin:10,width:100,height:100,background:'#F00',
      fontSize:32,writingMode:'verticalLr'}}>
      <span style={{background:'#0ff'}}>aaaaaaa</span>
    </div>
    <div style={{margin:10,height:100,background:'#F00',
      fontSize:32,writingMode:'verticalLr',}}>
      <span style={{fontSize:24,background:'#0F0'}}>a</span>
      <span style={{background:'#0FF'}}>b</span>
    </div>
    <div style={{margin:10,height:50,background:'#CCC',overflow:'hidden',
      whiteSpace:'nowrap',textOverflow:'ellipsis',writingMode:'vertical-lr'}}>
      <span>222222222</span>
    </div>
  </canvas>,
  '#test'
);
