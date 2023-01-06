class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }

  componentDidMount() {
    let input = document.querySelector('#base64');
    input.value = 1;
  }
  render() {
    return <div>123</div>;
  }
}

let root = karas.render(
  <canvas width="360" height="360"></canvas>,
  '#test'
);
root.freeze();
root.appendChild(<Component/>);
