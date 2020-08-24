class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = { a: 1 };
  }

  render() {
    return <Component2 a={this.state.a}/>;
  }
}

class Component2 extends karas.Component {
  shouldComponentUpdate() {
    input.value += 'shouldComponentUpdate';
    return true;
  }
  componentWillUnmount() {
    input.value += 'componentWillUnmount';
  }
  render() {
    return <div>{this.props.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
o.ref.c.setState({ a: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
