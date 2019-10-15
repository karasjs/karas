function render(child) {
  karas.render(
    <canvas width="360" height="360">
      {child}
    </canvas>,
    '#test'
  );
}

render(<div>123</div>);
