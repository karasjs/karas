karas.refresh.Page.CONFIG = {
  SIZE:   [8, 16, 32, 64],
  NUMBER: [8,  8,  8,  8],
};

karas.render(
  <canvas width="360" height="360" cache="1">
    <div cacheAsBitmap={1} style={{width:300,height:300,background:'#F00'}}>
      <div style={{width:100,height:100,background:'#00F',color:'#FFF',mixBlendMode:'multiply'}}>aaa</div>
    </div>
  </canvas>,
  '#test'
);
