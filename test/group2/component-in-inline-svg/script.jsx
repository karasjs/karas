class Component extends karas.Component {
  render() {
    return <span>1</span>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'inline'}}>
      <Component />
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = document.querySelector('svg').innerHTML;
