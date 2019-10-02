karas.render(
  <canvas width="360" height="360">
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}} control={[[0.2, 0.5], [0.8, 0.5]]}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}} start={[0.4,0.4]} end={[0.5,0.5]}/>
  </canvas>,
  '#test'
);
