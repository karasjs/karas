let o = karas.render(
  <svg width="360" height="360">
    <$line style={{width:100,height:100}}
           xa={[0.1, 0.5]} ya={[0.1, 0.5]}
           xb={[0.6, 0.8]} yb={[0.6, 0.8]}
           controlA={[null, [0.3, 0.5]]}
           controlB={[[0.5, 0.7], [0.5, 0.7]]} multi={true}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
