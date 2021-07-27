class Component extends karas.Component {
  componentDidMount() {
    this.setState({
      a: 'b',
    });
  }
  render() {
    return <div>{this.state.a || 'a'}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100}}>
      <Component/>
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
setTimeout(function() {
input.value = document.querySelector('svg').innerHTML;
}, 20);
