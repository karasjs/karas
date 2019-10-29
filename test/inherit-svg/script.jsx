let o = karas.render(
  <svg width="360" height="360">
    <div style={{fontStyle:'italic',fontSize:30,color:'#F00',fontWeight:700,textAlign:'right'}}>a<span>b</span>
      <div>c</div>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
