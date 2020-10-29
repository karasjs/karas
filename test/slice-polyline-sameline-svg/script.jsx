let o = karas.render(
  <svg width="360" height="360">
    <$polyline
      style={{width:200,height:200}}
      start="0.4"
      end="0.6"
      points={[
        [0, 0],
        [1, 0]
      ]}
      controls={[
        [0.2, 1, 0.8, 1]
      ]}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
