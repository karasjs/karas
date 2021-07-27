let input = document.querySelector('#base64');

class Father extends karas.Component {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  render() {
    if(this.state.a === 1) {
      return <div>
        <Child a={this.state.a}/>
      </div>;
    }
    return <div>
      <span>haha</span>
      <Child a={this.state.a}/>
    </div>;
  }
}

class Child extends karas.Component {
  componentDidMount() {
    input.value += 'componentDidMount';
  }
  componentWillUnmount() {
    input.value += 'componentWillUnmount';
  }
  render() {
    return <div>{this.props.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Father ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 2 }, function() {
  input.value += JSON.stringify(o.virtualDom);
});
