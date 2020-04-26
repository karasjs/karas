class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return 'text';
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
