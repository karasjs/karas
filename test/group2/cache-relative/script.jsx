let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{position:'absolute',left:20,top:10,width:60,height:60,background:'#F00'}}>
      <span style={{position:'relative',left:-10,background:'#0F0'}}>abcd</span>
      <span style={{position:'relative',display:'block',left:-10,background:'#00F'}}>abcd</span>
      <span style={{position:'relative',display:'inlineBlock',left:-10,background:'#0FF'}}>abcd</span>
    </div>
  </canvas>,
  '#test'
);
