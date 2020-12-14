let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:35,top:20,width:100,height:200,background:'radial-gradient(ellipse farthest-side at 30% 10%,#F00 , #00F)'}}/>
    <div style={{position:'absolute',left:165,top:20,width:100,height:80,background:'radial-gradient(ellipse farthest-corner at 30% 10%,#F00 , #00F)'}}/>
    <div style={{position:'absolute',left:35,top:240,width:100,height:80,background:'radial-gradient(ellipse closest-side at 30% 10%,#F00 , #00F)'}}/>
    <div style={{position:'absolute',left:165,top:240,width:100,height:80,background:'radial-gradient(ellipse closest-corner at 30% 10%,#F00 , #00F)'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
