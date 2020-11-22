let o = karas.render(
  <canvas width="360" height="360">
    <div style={{
      translateX: 50,
    }}>
      <div
        ref="t"
        style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',background:'#F00'}}>123</div>
      <$polygon
        mask="true"
        points={[
          [0, 0],
          [1, 1],
          [0, 1]
        ]}
        style={{position:'absolute',left:50,top:50,width:50,height:50,fill:'#fff',translateY:50}}/>
    </div>
  </canvas>,
  '#test'
);
