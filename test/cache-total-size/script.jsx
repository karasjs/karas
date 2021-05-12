karas.refresh.Page.CONFIG = {
  SIZE:   [8, 16, 32, 64, 128],
  NUMBER: [8,  8,  8,  8,   8],
};

let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:70,top:70,width:50,height:50,background:'#00F',filter:'blur(2)'}}/>
    </div>
    <div style={{position:'absolute',left:0,top:110,width:100,height:100,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:70,top:70,width:70,height:70,background:'#00F',filter:'blur(2)'}}/>
    </div>
    <div style={{position:'absolute',left:110,top:0,width:60,height:60,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:30,top:30,width:70,height:70,background:'#00F',filter:'blur(2)'}}/>
    </div>
  </canvas>,
  '#test'
);
