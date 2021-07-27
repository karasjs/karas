class Component extends karas.Component {
  render() {
    if(this.state.a === 1) {
      return <div><span ref="a">123</span></div>
    }
    return <div ref="b">123</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

let cp = o.children[0];
cp.setState({
  a: 1,
}, function() {
  let input = document.querySelector('#base64');
  input.value = cp.ref.a.tagName + cp.ref.b;
});
