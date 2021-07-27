class Component extends karas.Component {
  render() {
    return 'text';
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
