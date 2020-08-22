let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    return <div>
      <Child key="k" a={this.state.a}/>
    </div>;
  }
}

class Child extends karas.Component {
  componentDidMount() {
    this.shadowRoot.animate([
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
    return <div>{this.props.a}</div>;
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
  }, 300);
});
