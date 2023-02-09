let o = karas.render(
  <svg width="360" height="360">
    <$polygon style={{width:100,height:100}}
              points={[
                [0, 0],
                [1, 1],
                [0, 1],
              ]}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.once('refresh', function() {
  input.value += 1;
});
o.children[0].updateStyle({
  points: [
    [0, 0],
    [1, 1],
    [0, 1],
  ],
}, function() {
  input.value += 2;
});
