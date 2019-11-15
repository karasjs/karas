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
  render() {
    return <span style={{background:'linear-gradient(#F00,#00F)'}}>456</span>;
  }
}

render(<div>123</div>);
render(<Component/>);
