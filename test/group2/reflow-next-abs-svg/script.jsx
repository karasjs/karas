let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'relative',padding:10,background:'#00F'}} ref="middle">
      <div style={{padding:10,background:'#0F0'}} ref="inner">123</div>
      <div style={{position:'absolute',top:200,left:0}}>next</div>
      <div style={{position:'absolute',top:'20%',left:50}}>next2</div>
      <div style={{position:'absolute',bottom:0,left:100}}>next3</div>
      <div style={{position:'absolute',bottom:'20%',left:150}}>next4</div>
      <div style={{position:'absolute',left:200}}>next5</div>
      <div style={{position:'absolute',top:100,left:250,height:'50%',background:'#F00'}}>next6</div>
    </div>
  </svg>,
  '#test'
);
o.ref.inner.updateStyle({
  padding: 30,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
