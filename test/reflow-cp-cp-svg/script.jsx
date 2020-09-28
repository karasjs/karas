class Father extends karas.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div style={{padding:10,background:'#F00'}}>
      <Child ref="child"/>
      <div>next3</div>
      <div style={{padding:10,background:'#0F0'}}>
        <Child ref="child2"/>
        <div>next4</div>
      </div>
    </div>;
  }
}

class Child extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 1,
    };
  }
  render() {
    if(this.state.a === 1) {
      return <div style={{padding:10,background:'#666'}}>{this.state.a}</div>;
    }
    return <div style={{padding:30,background:'#CCC'}}>{this.state.a}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{padding:10,background:'#00F'}} ref="middle">
      <Father ref="father"/>
      <div>next1</div>
    </div>
    <div>next2</div>
  </svg>,
  '#test'
);
o.ref.father.ref.child2.setState({
  a: 2,
});
o.ref.father.ref.child.setState({
  a: 2,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
