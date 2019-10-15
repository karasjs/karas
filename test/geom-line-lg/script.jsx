karas.render(
  <canvas width="360" height="360">
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}} controlA={[0.2, 0.5]} controlB={[0.8, 0.5]}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}}/>
    <$line style={{width:100,height:100,stroke:'linear-gradient(#F00, #00F)'}} x1={0.4} y1={0.4} x2={0.5} y2={0.5}/>
  </canvas>,
  '#test'
);
