class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }
  render() {
    return <Component2/>;
  }
}

class Component2 extends karas.Component {
  constructor(...data) {
    super('cp2', ...data);
  }
  render() {
    return <div>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
