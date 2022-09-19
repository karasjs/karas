karas.render(
  <canvas width="360" height="360">
    <div>looooooooooooooong</div>
    <div
      ref="t"
      style={{position:'absolute',left:5,top:10,width:100,height:100,background:'#F00'}}>123</div>
    <div
      mask="true"
      style={{position:'absolute',left:0,top:0,width:30,height:30,background:'#EEE'}}/>
    <div
      mask="true"
      style={{position:'absolute',left:60,top:10,width:10,height:10,background:'#EEE'}}/>
  </canvas>,
  '#test'
);
