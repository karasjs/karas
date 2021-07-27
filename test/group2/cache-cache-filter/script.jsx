let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{margin:50,background:'#F00',filter:'blur(1)'}} ref="div">
      <span ref="span">123</span>
    </div>
  </canvas>,
  '#test'
);
