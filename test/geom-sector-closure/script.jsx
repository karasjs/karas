karas.render(
  <canvas width="360" height="360">
    <$sector end="290" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" edge="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" edge="true" closure="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" closure="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="90" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
  </canvas>,
  '#test'
);
