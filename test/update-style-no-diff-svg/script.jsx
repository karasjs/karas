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
o.on('refresh', function(lv) {
  input.value += lv;
});
o.children[0].updateStyle({
  points: [
    [0, 0],
    [1, 1],
    [0, 1],
  ],
}, function(n) {
  input.value += n;
});
