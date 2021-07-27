let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

function render(child) {
  karas.render(
    <canvas width="360" height="360">
      {child}
    </canvas>,
    '#test'
  );
}

render(<div>123</div>);
render(<span onClick={() => cb(1)}>456</span>);
