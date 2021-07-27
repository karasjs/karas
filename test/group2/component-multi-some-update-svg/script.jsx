let input = document.querySelector('#base64');

class Component extends karas.Component {
  render() {
    return <div>
      <Child a={1} ref="c1"/>
      <Child a={2} ref="c2"/>
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
    return <span>{this.props.a}</span>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.ref.c2.setState({ b: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
