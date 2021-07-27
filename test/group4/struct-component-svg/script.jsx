class Father extends karas.Component {
  render() {
    return <div>
      <span>1</span>
      <Child/>
    </div>;
  }
}

class Child extends karas.Component {
  render() {
    return <p>2</p>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Father/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.__structs.map(item => {
  item[karas.enums.STRUCT_KEY.STRUCT_NODE] = item[karas.enums.STRUCT_KEY.STRUCT_NODE].tagName || 'text';
  return item;
}));
