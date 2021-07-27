class Component extends karas.Component {
  render() {
    return <div>a</div>;
  }
}

class Component2 extends karas.Component {
  render() {
    return 'b';
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',padding:10,background:'#00F'}}>
      <span>2</span>
      <Component style={{flex:1}}/>
      <Component2/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
