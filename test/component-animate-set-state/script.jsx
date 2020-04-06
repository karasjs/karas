class Component extends karas.Component {
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
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

let c = o.children[0];
let a = c.shadowRoot.animate([{
  translateX: 0,
}, {
  translateX: 100,
}], {
  duration: 500,
  fill: 'both',
});
a.on('finish', () => {
  let input = document.querySelector('input');
  input.value = c.shadowRoot.computedStyle.translateX;
});
c.setState({
  t: 456,
});
