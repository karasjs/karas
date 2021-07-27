class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 0,
    };
  }
  componentDidMount() {
    this.setState({
      text: 1,
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
  <webgl width="360" height="360">
    <Component/>
  </webgl>,
  '#test'
);
