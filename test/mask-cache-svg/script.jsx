let o = karas.render(
  <svg width="360" height="360">
    <div ref="n">looooooooooooooong</div>
    <div
      ref="t"
      style={{position:'absolute',left:5,top:10,width:100,height:100,background:'#F00'}}>123</div>
    <$polygon
      ref="m"
      mask="true"
      points={[
        [0,0],
        [1,1],
        [0,1]
      ]}
      style={{position:'absolute',left:0,top:0,width:100,height:100,strokeWidth:0,fill:'#EEE'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
o.ref.t.updateStyle({
  translateX: 10,
}, function() {
  o.ref.m.updateStyle({
    translateX: 5,
  }, function() {
    o.ref.t.updateStyle({
      translateX: 0,
    }, function() {
      input.value = JSON.stringify(document.querySelector('svg').innerHTML);
    });
  });
});
