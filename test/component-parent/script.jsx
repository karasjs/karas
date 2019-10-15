class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
    this.state = {
      text: '123',
    };
  }
  click() {
    this.setState({
      text: this.parent.tagName,
    });
  }
  render() {
    return <div onClick={()=>this.click()}>{this.state.text}</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
