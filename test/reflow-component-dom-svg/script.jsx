class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 1,
    };
  }
  render() {
    if(this.state.a === 1) {
      return <div style={{padding:10,background:'#F00'}}>{this.state.a}</div>;
    }
    return <div style={{padding:30,background:'#F00'}}>{this.state.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#00F'}} ref="middle">
      <Component ref="inner"/>
      <div>next1</div>
    </div>
    <div>next2</div>
  </svg>,
  '#test'
);
o.ref.inner.setState({
  a: 2,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
