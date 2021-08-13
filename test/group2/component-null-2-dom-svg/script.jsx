class Component extends karas.Component {
  render() {
    if(this.state.a) {
      return <div>2</div>;
    }
    return null;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 1 }, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
