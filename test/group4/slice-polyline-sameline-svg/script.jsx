let o = karas.render(
  <svg width="360" height="360">
    <$polyline
      style={{width:100,height:100}}
      start="0.4"
      end="0.6"
      points={[
        [0, 0],
        [1, 0]
      ]}
      controls={[
        [0.2, 1, 0.8, 1]
      ]}/>
    <$polyline start={0.2} end={1.1} style={{
      margin:10,
      width: 100,
      height: 100,
    }} points={[
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ]} controls={[
      [0.5, 0.5]
    ]}/>
    <$polyline start={0.2} end={1.1} style={{
      margin:10,
      width: 100,
      height: 100,
    }} points={[
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ]}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
