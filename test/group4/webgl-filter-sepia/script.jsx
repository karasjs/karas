let o = karas.render(
  <webgl width="360" height="360">
    <div style={{width:50,height:50,background:'#F00',filter:'sepia(50%)'}}/>
    <div style={{width:50,height:50,background:'#39F',filter:'sepia(50%)'}}/>
    <div style={{width:50,height:50,background:'#F93',filter:'sepia(30%)'}}/>
  </webgl>,
  '#test'
);
