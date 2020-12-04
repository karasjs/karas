class Component extends karas.Component {
  render() {
    if(this.state.a === 1) {
      return <div><strong>b</strong></div>;
    }
    return <div>a</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <span>0</span>
    <Component ref="c1"/>
    <p>1</p>
    <Component ref="c2"/>
    <span>2</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.c1.setState({ a: 1 });
o.ref.c2.setState({ a: 1 }, function() {
  input.value = JSON.stringify(o.__structs.map(item => {
    item[karas.enums.STRUCT_NODE] = item[karas.enums.STRUCT_NODE].tagName || 'text';
    return item;
  }));
});
