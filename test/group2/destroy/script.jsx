let n = 0;

function click() {
  document.querySelector('input').value = ++n;
}

class Component extends karas.Component {
  render() {
    return <div onClick={click}>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
