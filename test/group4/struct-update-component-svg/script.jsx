class Component extends karas.Component {
  render() {
    if(this.state.a === 1) {
      return <div>a<span>b</span></div>;
    }
    return <div>a</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <span>1</span>
    <Component ref="c"/>
    <span>2</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.c.setState({ a: 1 }, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item.node = item.node.tagName || 'text';
    return item;
  }));
});
