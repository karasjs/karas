let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    if(this.state.a === 1) {
      return <div>
        <span key="k">{this.state.a}</span>
        <span>haha</span>
      </div>;
    }
    return <div>
      <span>haha</span>
      <span>{this.state.a}</span>
    </div>;
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
