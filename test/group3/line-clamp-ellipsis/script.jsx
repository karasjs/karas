karas.render(
  <canvas width="360" height="360">
    <div style={{width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden',textOverflow:'ellipsis'}}>
      <span style={{marginRight:10,background:'#f00',color:'#0F0'}}>11111abc</span>
    </div>

    <div style={{width:50,border:'1px solid #000',whiteSpace:'nowrap',fontSize:24,overflow:'hidden',textOverflow:'ellipsis'}}>
      <span style={{marginRight:10,background:'#f00',color:'#0F0'}}>11111abc<strong>x</strong><b>yz</b></span>
    </div>

    <div style={{width:50,border:'1px solid #000',lineClamp:2,fontSize:24}}>
      <span style={{marginRight:10,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc<strong>x</strong><b>yz</b></span>
    </div>

    <div style={{width:50,border:'1px solid #000',lineClamp:2,fontSize:24}}>
      <span style={{marginRight:10,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc<strong>x</strong><b>yz</b></span>
    </div>

    <div style={{width:50,border:'1px solid #000',lineClamp:2,fontSize:24}}>
      <span style={{marginRight:10,background:'#f00',fontSize:18,color:'#0F0'}}>11111abcd<strong>x</strong><b>y</b></span>
    </div>

    <div style={{width:50,border:'1px solid #000',lineClamp:2,fontSize:24}}>
      <span style={{marginRight:10,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc<strong>xyz</strong><b>yz</b></span>
    </div>


    <div style={{position:'absolute',left:180,top:0,width:50,border:'1px solid #000',lineClamp:2,fontSize:24,}}>
      <span style={{paddingRight:11,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc</span>
    </div>

    <div style={{position:'absolute',left:180,top:60,width:50,border:'1px solid #000',lineClamp:2,fontSize:24,}}>
      <span style={{paddingRight:11,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc<strong>x</strong></span>
    </div>

    <div style={{position:'absolute',left:180,top:120,width:50,border:'1px solid #000',lineClamp:2,fontSize:24,}}>
      <span style={{paddingRight:11,background:'#f00',fontSize:18,color:'#0F0'}}>11111abc<strong>x</strong><b>y</b></span>
    </div>
  </canvas>,
  '#test'
);
