let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  componentDidMount() {
    this.ref.c.animate([
      {
        fill: '#F00',
      },
      {
        fill: '#00F'
      }
    ], {
      duration: 200,
      fill: 'both',
    });
  }
  render() {
    if(this.state.a === 1) {
      return <div>
        <$circle ref="c" r={0.5}/>
      </div>;
    }
    return <div>
      <$circle ref="c" multi="true" r={[0.5, .08]}/>
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
