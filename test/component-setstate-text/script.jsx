class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      text: 123,
    };
  }
  componentDidMount() {
    this.setState({
      text: 456,
    }, function() {
      let input = document.querySelector('#base64');
      input.value = document.querySelector('canvas').toDataURL();
    });
  }
  render() {
    return <div>{this.state.text}</div>;
  }
}

let o = karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
