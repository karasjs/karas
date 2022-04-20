karas.render(
  <canvas width="360" height="360" style={{writingMode:'verticalLr'}}>
    <div style={{margin:10,width:100,height:100,background:'#F00',}}/>
    <div style={{margin:10,background:'#0FF',
      fontSize:32,writingMode:'horizontal-tb'}}>
      {'a'}
    </div>
  </canvas>,
  '#test'
);
