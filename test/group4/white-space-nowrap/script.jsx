karas.render(
  <canvas width="360" height="360">
    <div style={{width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111</span>
      <strong style={{fontSize:16}}>a</strong>
      <b style={{fontSize:16}}><span>b</span></b>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:16,color:'#0F0'}}>1111</span>
      <strong style={{fontSize:16,display:'inlineBlock'}}>a</strong>
      <b style={{fontSize:16}}>b</b>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111</span>
      <strong style={{fontSize:32,display:'inlineBlock'}}>a</strong>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{display:'inlineBlock',background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
    </div>

    <div style={{marginTop:10,width:50,border:'1px solid #000',overflow:'hidden',whiteSpace:'nowrap',fontSize:24,textOverflow:'ellipsis'}}>
      <span style={{display:'inlineBlock',background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
      <strong style={{fontSize:18}}>a</strong>
    </div>


    <div style={{position:'absolute',left:180,top:0,width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
      <strong style={{fontSize:32,display:'inlineBlock'}}>a</strong>
      <b style={{fontSize:32,display:'inlineBlock'}}>b</b>
    </div>

    <div style={{position:'absolute',left:180,top:50,width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
      <strong style={{fontSize:32,display:'inlineBlock'}}>a</strong>
      <b style={{fontSize:32,display:'inlineBlock'}}>b</b>
    </div>

    <div style={{position:'absolute',left:180,top:100,width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden',textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111111</span>
      <strong style={{fontSize:32,display:'inlineBlock'}}>a</strong>
      <b style={{fontSize:32,display:'inlineBlock'}}>b</b>
    </div>

    <div style={{position:'absolute',left:180,top:150,width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden',textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111<strong style={{fontSize:32}}>a</strong></span>
    </div>

    <div style={{position:'absolute',left:180,top:200,width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden',textOverflow:'ellipsis'}}>
      <span style={{background:'#f00',fontSize:18,color:'#0F0'}}>1111<strong style={{fontSize:32}}><b>b</b></strong></span>
    </div>
  </canvas>,
  '#test'
);
