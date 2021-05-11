let input = document.querySelector('input');

class Component extends karas.Component {
  componentDidMount() {
    input.value += this.state.t;
  }
  constructor(...data) {
    super(...data);
    this.state = {
      t: 123,
    };
  }
  render() {
    return <div>{this.state.t}</div>;
  }
}

let o = karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);

let c = o.children[0];
let a = c.shadowRoot.animate([{
  translateX: 0,
}, {
  translateX: 100,
}], {
  duration: 50,
  fill: 'both',
});
a.on('finish', () => {
  input.value += c.shadowRoot.getComputedStyle().translateX;
});
c.setState({
  t: 456,
});
