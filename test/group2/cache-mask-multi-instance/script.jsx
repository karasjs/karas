karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} ref="div" style={{width:100,height:100,background:'#F00'}}>aaaaaa</div>
    <$rect style={{position:'absolute',left:50,top:0,width:100,height:100,fill:'#FFF'}}/>
  </canvas>,
  '#test2'
);
karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} ref="div" style={{width:100,height:100,background:'#F00'}}>aaaaaa</div>
    <$rect mask={1} style={{position:'absolute',left:50,top:0,width:100,height:100,fill:'#FFF'}}/>
  </canvas>,
  '#test'
);
