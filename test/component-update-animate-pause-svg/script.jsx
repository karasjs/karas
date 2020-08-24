let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  componentDidMount() {
    let a = this.shadowRoot.animate([
      {
        color: '#F00',
      },
      {
        color: '#00F'
      }
    ], {
      duration: 200,
      fill: 'both',
    });
    a.gotoAndStop(100);
  }
  render() {
    return <div>{this.state.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 2 }, function() {
  setTimeout(function() {
    input.value += JSON.stringify(o.virtualDom);
  }, 100);
});
