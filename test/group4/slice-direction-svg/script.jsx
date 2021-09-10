let o = karas.render(
  <svg width="360" height="360">
    <$polyline style={{width:200,height:100,fill:'#F00'}} points={[
      [
        0.94011538315336,
        0
      ],
      [
        1,
        0.11759937640174
      ],
      [
        1,
        0.88240062359826
      ],
      [
        0.94011538315336,
        1
      ],
      [
        0.05988461684664,
        1
      ],
      [
        0,
        0.88240062359826
      ],
      [
        0,
        0.11759937640174
      ],
      [
        0.05988461684664,
        0
      ],
      [
        0.94011538315336,
        0
      ]
    ]} start="0.3"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
