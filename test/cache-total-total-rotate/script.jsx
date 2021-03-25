let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'relative',background:'#F00',padding:10}}>
      <span style={{position:'relative',display:'inlineBlock',rotate:45,padding:10,background:'#00F'}}>
        <span style={{display:'inlineBlock',padding:10,background:'#0F0'}}>123</span>
      </span>
    </div>
  </canvas>,
  '#test'
);
