function render(child) {
  let o = karas.render(
    <svg width="360" height="360">
      {child}
    </svg>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}

class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }
  render() {
    return 'abc';
  }
}

render(<div>123</div>);
render(<Component/>);
