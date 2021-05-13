karas.refresh.Page.CONFIG = {
    SIZE:   [8, 16, 32],
    NUMBER: [8,  8,  8],
};

let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:10,top:10,width:200,height:200,background:'linearGradient(#F00,#00F)'}}>a</div>
    <$rect style={{position:'absolute',left:100,top:100,width:200,height:200,fill:'#0F0',opacity:0.5}}/>
  </webgl>,
  '#test'
);
