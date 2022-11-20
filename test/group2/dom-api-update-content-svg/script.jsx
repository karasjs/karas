let root = karas.render(
  <svg width="360" height="360">
    <div style={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      <span ref="span">a</span><span>b</span>
    </div>
  </svg>,
  '#test'
);
root.ref.span.children[0].updateContent('haha', function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
