let o = karas.render(
  <canvas width="360" height="360">
    <div style={{margin:10,width:50,background:'#CCC'}}>
      <span style={{background:'url(../../image.png) no-repeat center'}}>22222<strong style={{fontSize:50,padding:3}}>33</strong>2</span>
    </div>
    <div style={{margin:10,height:50,background:'#CCC',writingMode:'vertical-lr'}}>
      <span style={{background:'url(../../image.png) no-repeat center'}}>22222<strong style={{fontSize:50,padding:3}}>33</strong>2</span>
    </div>
  </canvas>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
