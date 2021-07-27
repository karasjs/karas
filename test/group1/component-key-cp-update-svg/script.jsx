let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    return <div>
      <Child key="k"/>
      <span>aa</span>
    </div>;
  }
}

class Child extends karas.Component {
  shouldComponentUpdate() {
    input.value += 'shouldComponentUpdate';
  }
  render() {
    return <div>haha</div>;
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
