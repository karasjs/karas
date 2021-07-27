let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  componentDidUpdate() {
    input.value += JSON.stringify(o.virtualDom);
  }
  render() {
    return <div>{this.state.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 2 });
