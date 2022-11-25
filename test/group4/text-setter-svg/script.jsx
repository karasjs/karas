let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
    }}>aaa<p ref="free">bbb</p></div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.on('refresh', function() {
  input.value = document.querySelector('svg').innerHTML;
});
o.ref.free.children[0].content = 'ccc';
