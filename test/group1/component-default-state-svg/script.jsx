let input = document.querySelector('#base64');

class Component extends karas.Component {
  state = {
    a : 10
  }

  componentDidMount(){
    this.setState({
      a: 1,
    }, function() {
      input.value += JSON.stringify(o.virtualDom);
    });
  }

  render() {
    return <div>{this.state.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

input.value += JSON.stringify(o.virtualDom);
