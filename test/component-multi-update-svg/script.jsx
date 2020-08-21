let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = { a: 1 };
  }
  render() {
    return <div>
      <Child a={this.state.a} ref="c1"/>
      <Child a={this.state.a}/>
    </div>;
  }
}

class Child extends karas.Component {
  constructor(props) {
    super(props);
    this.state = { b: 1 };
  }
  shouldComponentUpdate(nextProps, nextState) {
    input.value += 'shouldComponentUpdate' + JSON.stringify(nextProps) + JSON.stringify(nextState);
    return true;
  }
  render() {
    return <span>{this.props.a}{this.state.b}</span>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 2 });
o.ref.c.ref.c1.setState({ b: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
