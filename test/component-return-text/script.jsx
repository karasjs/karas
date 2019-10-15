class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }
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
