class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      text: 123,
    };
  }
  render() {
    return <div onClick={() => this.setState({text:456})}>{this.state.text}</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
