let o = karas.render(
  <svg width="360" height="360">
    <div>looooooooooooooong</div>
    <div
      ref="t"
      style={{position:'absolute',left:5,top:10,width:100,height:100,background:'#F00'}}>123</div>
    <$polygon
      mask="true"
      points={[
      ]}
      style={{position:'absolute',left:0,top:0,width:100,height:100,strokeWidth:0,fill:'#EEE'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
