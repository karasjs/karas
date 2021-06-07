let o = karas.render(
  <webgl width="360" height="360">
    <div style={{margin:100,width:100,height:100,background:'linear-gradient(#F00,#00F)',
      transform:'perspective(200)rotate3d(1, 1, 1, 45)'}}/>
  </webgl>,
  '#test'
);
