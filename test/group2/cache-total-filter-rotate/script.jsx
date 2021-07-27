let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',margin:50,background:'#F00'}} ref="div">
      <span ref="span" style={{rotateZ:60,filter:'blur(1)'}}>123</span>
    </div>
  </canvas>,
  '#test'
);
