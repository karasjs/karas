karas.render(
  <canvas width="360" height="360">
    <$polyline style={{width:100,height:50}} points={[[0.2,0.2],[0.8,0.5],[0.5,0.8]]} origin="BOTTOM_LEFT"/>
    <$polyline style={{width:100,height:50,stroke:'linear-gradient(#F00, #00F)'}} points={[[0.2,0.2],[0.8,0.8],[0.5,0.8]]}/>
  </canvas>,
  '#test'
);
