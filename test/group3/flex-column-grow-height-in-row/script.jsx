karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',height:'100%'}}>
      <div style={{display:'flex',flexDirection:'column',height:100,background:'#F0F0FF'}}>
        <span style={{flex:1}}>1</span>
        <span style={{flex:1}}>2</span>
      </div>
      <div style={{flex:1,background:'#FFF0F0'}}>3</div>
    </div>
  </canvas>,
  '#test'
);
