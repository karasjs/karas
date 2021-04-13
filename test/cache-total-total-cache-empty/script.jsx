let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',left:'50%',top:'50%',padding:2,background:'#F00'}} ref="div">
      <span ref="span" style={{position:'absolute',display:'inlineBlock',padding:2}}>
        <span style={{display:'inlineBlock',padding:6}}>123</span>
      </span>
    </div>
  </canvas>,
  '#test'
);
