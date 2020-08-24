let input = document.querySelector('#base64');

class Father extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    return <div>
      <Child a={this.state.a}/>
    </div>;
  }
}

class Child extends karas.Component {
  shouldComponentUpdate(nextProps, nextState) {
    input.value += JSON.stringify(nextProps) + JSON.stringify(nextState);
    input.value += JSON.stringify(this.props) + JSON.stringify(this.state);
    return true;
  }
  render() {
    return <div>{this.props.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Father ref="c"/>
  </svg>,
  '#test'
);

input.value = JSON.stringify(o.virtualDom);

o.ref.c.setState({ a: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
