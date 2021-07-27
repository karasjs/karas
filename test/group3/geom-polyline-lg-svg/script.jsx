let o = karas.render(
  <svg width="360" height="360">
    <$polyline style={{width:100,height:50}} points={[[0.2,0.2],[0.8,0.5],[0.5,0.8]]}/>
    <$polyline style={{width:100,height:50,stroke:'linear-gradient(#F00, #00F)'}} points={[[0.2,0.2],[0.8,0.8],[0.5,0.8]]}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
