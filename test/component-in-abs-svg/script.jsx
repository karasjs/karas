class Component extends karas.Component {
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

let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
