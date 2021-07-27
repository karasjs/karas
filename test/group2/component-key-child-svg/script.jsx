let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    return <div>
      <div key="i">
        <span>aa</span>
        <span key="j">{this.state.a}</span>
        <Child a={this.state.a}/>
      </div>
    </div>;
  }
}

class Child extends karas.Component {
  componentDidMount() {
    input.value += 'componentDidMount';
  }
  shouldComponentUpdate() {
    input.value += 'shouldComponentUpdate';
    return true;
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

o.ref.c.setState({ a: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
