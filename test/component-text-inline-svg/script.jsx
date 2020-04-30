class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return 456;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <span>123</span><Component/>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
