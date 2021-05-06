let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'linearGradient(#F00,#00F)',rotate:45,overflow:'hidden'}}>
      <span style={{position:'absolute',left:10,top:30,width:40,height:50,background:'#FFF',rotate:90}}>a</span>
    </div>
  </webgl>,
  '#test'
);
