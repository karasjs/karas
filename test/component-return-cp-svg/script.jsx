class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <Component2/>;
  }
}

class Component2 extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div>123</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
