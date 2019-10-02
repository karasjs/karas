karas.render(
  <canvas width="360" height="360">
    <$sector style={{width:50,height:50}} start="0" end="30"/>
    <$sector style={{width:50,height:50,stroke:'linear-gradient(#F00,#00F)'}} start="0" end="200"/>
    <$sector style={{width:50,height:50,fill:'linear-gradient(#F00,#00F)'}} start="100" end="200"/>
    <$sector style={{width:50,height:50,fill:'radial-gradient(#F00,#00F)'}} start="200" end="300"/>
    <$sector style={{width:50,height:50}} start="100" end="300" r="0.5"/>
  </canvas>,
  '#test'
);
