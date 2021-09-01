let input = document.querySelector('#base64');

class Component2 extends karas.Component {
  componentDidMount() {
    input.value += 'componentDidMount';
  }
  shouldComponentUpdate() {
    input.value += 'shouldComponentUpdate';
    return false;
  }
  componentWillUnmount() {
    input.value += 'componentWillUnmount';
  }
  render() {
    return <span>b</span>;
  }
}
let component2 = <Component2/>;

class Component extends karas.Component {
  componentDidMount() {
    let a = 0;
    this.setState({
      a: ++a,
    });
  }
  render() {
    return <div>
      <span>{this.state.a || 0}</span>
      {component2}
    </div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
