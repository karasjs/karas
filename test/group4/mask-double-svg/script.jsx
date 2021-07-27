let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:200,height:200,background:'#F00'}}/>
    <$polygon
      mask="true"
      points={[
        [0, 0],
        [1, 1],
        [0, 1]
      ]}
      style={{position:'absolute',left:50,top:50,width:100,height:100,strokeWidth:0,fill:'#EEE'}}/>
    <div style={{position:'absolute',left:100,top:100,width:200,height:200,background:'#00F'}}/>
    <$polygon
      mask="1"
      points={[
        [0, 0],
        [1, 1],
        [0, 1]
      ]}
      style={{position:'absolute',left:150,top:150,width:100,height:100,strokeWidth:0,fill:'#EEE'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
