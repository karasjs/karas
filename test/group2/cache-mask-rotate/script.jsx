let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00',rotateZ:45}}>123</div>
    <$polygon style={{position:'absolute',left:10,top:10,width:80,height:80,fill:'#ccF',rotateZ:45}}
              points={[
                [0.5, 0],
                [1, 1],
                [0, 1],
              ]}
              mask="1"/>
  </canvas>,
  '#test'
);
