let o = karas.render(
  <svg width="360" height="360">
    <$polyline style={{width:100,height:100}}
               points={[
                 [0, 0],
                 [1, 0],
                 [1, 1],
               ]}
               controls={[
                 [0.2, 1, 0.8, 1],
               ]}
               start="0.2" end="0.9"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
