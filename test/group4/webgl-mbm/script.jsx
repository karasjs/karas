let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:20,top:20,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'multiply'}}/>
    <div style={{position:'absolute',left:60,top:0,width:40,height:40,background:'#F93'}}/>
    <div style={{position:'absolute',left:80,top:20,width:40,height:40,background:'#FFF',mixBlendMode:'multiply'}}/>
    <div style={{position:'absolute',left:120,top:0,width:40,height:40,background:'#F93'}}/>
    <div style={{position:'absolute',left:140,top:20,width:40,height:40,background:'#000',mixBlendMode:'multiply'}}/>
    <div style={{position:'absolute',left:180,top:0,width:40,height:40,background:'#FFF'}}/>
    <div style={{position:'absolute',left:200,top:20,width:40,height:40,background:'#F93',mixBlendMode:'multiply'}}/>
    <div style={{position:'absolute',left:240,top:0,width:40,height:40,background:'#000'}}/>
    <div style={{position:'absolute',left:260,top:20,width:40,height:40,background:'#F93',mixBlendMode:'multiply'}}/>

    <div style={{position:'absolute',left:0,top:80,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:20,top:100,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'color'}}/>
    <div style={{position:'absolute',left:60,top:80,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:80,top:100,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'color-burn'}}/>
    <div style={{position:'absolute',left:120,top:80,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:140,top:100,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'color-dodge'}}/>
    <div style={{position:'absolute',left:180,top:80,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:200,top:100,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'darken'}}/>
    <div style={{position:'absolute',left:240,top:80,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:260,top:100,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'difference'}}/>

    <div style={{position:'absolute',left:0,top:160,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:20,top:180,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'exclusion'}}/>
    <div style={{position:'absolute',left:60,top:160,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:80,top:180,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'hard-light'}}/>
    <div style={{position:'absolute',left:120,top:160,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:140,top:180,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'hue'}}/>
    <div style={{position:'absolute',left:180,top:160,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:200,top:180,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'lighten'}}/>
    <div style={{position:'absolute',left:240,top:160,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:260,top:180,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'luminosity'}}/>

    <div style={{position:'absolute',left:0,top:240,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:20,top:260,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'overlay'}}/>
    <div style={{position:'absolute',left:60,top:240,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:80,top:260,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'saturation'}}/>
    <div style={{position:'absolute',left:120,top:240,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:140,top:260,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'screen'}}/>
    <div style={{position:'absolute',left:180,top:240,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:200,top:260,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'soft-light'}}/>
    <div style={{position:'absolute',left:240,top:240,width:40,height:40,background:'#5F0',opacity:0.5}}/>
    <div style={{position:'absolute',left:260,top:260,width:40,height:40,background:'#C0F',opacity:0.5,mixBlendMode:'not-exist'}}/>
  </webgl>,
  '#test'
);
