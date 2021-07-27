let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

function render(child) {
  let o = karas.render(
    <svg width="360" height="360">
      {child}
    </svg>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}

render(<div>123</div>);
render(<span onClick={() => cb(1)}>456</span>);
