let o = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#CCC'}}>
      <div style={{background:'#999',position:'relative'}}>
        <div style={{position:'absolute',left:50}}>abs1</div>
        <div style={{background:'#F00',margin:'10 0 -5'}}>1</div>
        <div style={{background:'rgba(0,255,0,0.5)',margin:-15}} ref="b">2</div>
        <div>3</div>
        <div style={{position:'absolute',left:100}}>abs2</div>
        <div style={{position:'absolute',left:200,bottom:'30%'}}>abs3</div>
        <div style={{position:'absolute',left:250,top:'30%'}}>abs4</div>
        <div style={{position:'absolute',top:100,left:200,height:'50%',background:'#F00'}}>next5</div>
      </div>
      <div>4</div>
    </div>
    <div>5</div>
  </svg>,
  '#test'
);
o.ref.b.updateStyle({
  margin: -10,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
