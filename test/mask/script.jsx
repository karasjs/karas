karas.render(
  <canvas width="360" height="360">
    <div>looooooooooooooong</div>
    <div
      ref="t"
      style={{position:'absolute',left:5,top:10,width:100,height:100,background:'#F00'}}>123</div>
    <$polygon
      mask="true"
      points={[
        [0, 0],
        [1, 1],
        [0, 1]
      ]}
      style={{position:'absolute',left:0,top:0,width:100,height:100,strokeWidth:0,fill:'#EEE'}}/>
  </canvas>,
  '#test'
);
