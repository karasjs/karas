let o = karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}>123</div>
    <$polygon cacheAsBitmap={1} style={{position:'absolute',left:60,top:10,width:80,height:80,fill:'#ccF',strokeWidth:0}}
              points={[
                [0.5, 0],
                [1, 1],
                [0, 1],
              ]}/>
  </canvas>,
  '#test'
);
