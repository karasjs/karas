class A extends karas.Component {
  render() {
    if(this.state.a) {
      return <div><span>1</span><span>2</span></div>
    }
    return <div>1</div>
  }
}

class B extends karas.Component {
  render() {
    if(this.state.b) {
      return <div><span>a</span><span>b</span></div>
    }
    return <div>a</div>
  }
}

class C extends karas.Component {
  render() {
    return <div>0</div>
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <A/>
    <B/>
    <C/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.children[0].setState({
  a:1,
});
o.children[1].setState({
  b:1,
}, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item[karas.enums.STRUCT_KEY.STRUCT_NODE] = item[karas.enums.STRUCT_KEY.STRUCT_NODE].tagName || 'text';
    return item;
  }));
});
