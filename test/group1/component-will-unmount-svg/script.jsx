let input = document.querySelector('#base64');

class Component extends karas.Component {
  componentWillUnmount() {
    input.value = 1;
  }
  render() {
    return <div>123</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100}}>
      <Component/>
    </div>
  </svg>,
  '#test'
);

karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100}}>1</div>
  </svg>,
  '#test'
);
