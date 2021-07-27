class Component extends karas.Component {
  render() {
    return <Component2/>;
  }
}

class Component2 extends karas.Component {
  componentDidMount() {
    this.setState({
      a: 1
    });
  }

  componentDidUpdate() {
    let input = document.querySelector('#base64');
    input.value = document.querySelector('svg').innerHTML;
  }

  render() {
    return <div>{this.state.a || 0}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
