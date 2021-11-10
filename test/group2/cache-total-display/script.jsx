let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{position:'relative',background:'#F00',padding:10,height:50}}>
      <span style={{position:'absolute',rotate:45,padding:10,display:'none'}}>123</span>
    </div>
  </canvas>,
  '#test'
);
