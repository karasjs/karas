class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 123,
    };
  }
  render() {
    return this.state.a;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#00F'}} ref="middle">
      <Component ref="inner"/>
    </div>
    <div>next</div>
  </svg>,
  '#test'
);
o.ref.inner.setState({
  a: 456,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
