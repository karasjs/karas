function render(child) {
  karas.render(
    <canvas width="360" height="360">
      {child}
    </canvas>,
    '#test'
  );
}

class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }
  render() {
    return <span>456</span>;
  }
}

render(<div>123</div>);
render(<Component/>);
