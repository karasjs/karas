let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  componentDidMount() {
    this.ref.b.animate([
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
  }
  render() {
    if(this.state.a === 1) {
      return <div>
        <span ref="b">2</span>
      </div>;
    }
    return <div>
      <span key="a">1</span>
      <span ref="b">2</span>
    </div>;
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
  }, 250);
});
