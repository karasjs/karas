let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:80,top:80,width:50,height:50,background:'#00F'}}/>
    </div>
    <div style={{margin:10,overflow:'hidden'}}>客官你超越了全国15%的人！客官你超越了全国1</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
