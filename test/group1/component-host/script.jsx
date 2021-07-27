class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      text: '123',
    };
  }
  click(e) {
    this.setState({
      text: e.target.host.tagName,
    });
  }
  render() {
    return <div onClick={e=>this.click(e)}>{this.state.text}</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
