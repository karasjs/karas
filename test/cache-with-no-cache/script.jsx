karas.refresh.Page.CONFIG = {
  SIZE: [8, 16, 32, 64, 128],
  NUMBER: [8,  8,  8,  8,   8],
};

let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'relative',background:'#F00',padding:10,width:300,height:300}}>
      <span style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#0F0'}}>aaa</span>
      <strong style={{position:'absolute',left:100,top:100,width:200,height:200,background:'#00F'}}>bbb</strong>
    </div>
  </canvas>,
  '#test'
);
