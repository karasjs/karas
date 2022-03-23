karas.render(
  <canvas width="360" height="360">
    <div style={{width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111</span>
      <strong style={{fontSize:18}}>a</strong>
      <p style={{display:'inline',fontSize:18}}><span>b</span></p>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111</span>
      <strong style={{fontSize:18,display:'inlineBlock'}}>a</strong>
      <strong style={{fontSize:18}}>b</strong>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{display:'inlineBlock',background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
      <strong style={{fontSize:18}}>a</strong>
      <strong style={{fontSize:18}}>b</strong>
    </div>
  </canvas>,
  '#test'
);
