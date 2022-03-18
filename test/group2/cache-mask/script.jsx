let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}/>
    <$polygon style={{position:'absolute',left:10,top:10,width:80,height:80,fill:'#FFF',strokeWidth: 0}}
              points={[
                [0.5, 0],
                [1, 1],
                [0, 1],
              ]}
              mask="1"/>
    <div cacheAsBitmap={1} style={{position:'absolute',left:0,top:100,width:100,height:100,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:80,top:80,width:50,height:50,background:'#00F'}}/>
    </div>
    <$rect mask="1"
           style={{position:'absolute',left:10,top:110,width:120,height:120,strokeWidth:0,fill:'#FFF',filter:'blur(2)'}}/>
  </canvas>,
  '#test'
);
