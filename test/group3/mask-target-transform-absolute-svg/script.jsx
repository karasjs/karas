let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:100,height:100,
      background:'#F00',translateX:30}}/>
    <$polygon style={{position:'absolute',left:100,top:100,width:100,height:100,
      fill:'rgba(255, 255, 255, 0.5)',strokeWidth:0,rotateZ:20}}
      points={[
        [0, 0],
        [1, 0],
        [0.5, 1]
      ]}mask="1"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
